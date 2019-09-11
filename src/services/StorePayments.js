import {Alert , Platform} from "react-native";
import RNIap from 'react-native-iap';
import deepGet from "lodash/get";

import Toast from '../theme/components/NotificationToast';
import  { paymentEvents,  paymentEventsMap } from "../helpers/PaymentEvents";
import PepoApi from "../services/PepoApi";
import UserPayments from "../models/UserPayments";
import CurrentUser from "../models/CurrentUser";
import PollCurrentUserPendingPayments from "../helpers/PollCurrentUserPendingPayments";
import Utilities from "./Utilities";
import {ostErrors} from "../services/OstErrors";
import appConfig from "../constants/AppConfig";
import dataContract from "../constants/DataContract"; 

const maxRetryCount = 10 ;
const paymentAcknowledgeApi = dataContract.payments.postPaymentAcknowledgeApi ; 
const topUpStatusApi = dataContract.payments.getTopUpStatusApi; 
const topUpIdKey = dataContract.payments.topUpEntityId

//TODO remove all console logs 

class StorePayments {

    getProductsFromStore(itemSkus ,  successCallback ,  errorCallback ){
        try {
            RNIap.getProducts(itemSkus).then(( products ) => {
                console.log("getProductsFromStore" , itemSkus , products );
                successCallback && successCallback( products );
            }).catch(( error )=> {
                console.log("getProductsFromStore error" , itemSkus , error );
                errorCallback && errorCallback( error );
            });
          } catch(error) {
            console.log("getProductsFromStore error catch" , itemSkus , error );
            errorCallback && errorCallback( error );  
        }
    }

    //@Note : Success and error will be subscribtion based
    requestPurchase( skuId ){
        try {
            RNIap.initConnection().then((res)=> {
                RNIap.requestPurchase(skuId);
            }).catch((error)=> {
                console.log("initConnection error" , skuId , error );
                this.onInitRequestPurchaseError(error); 
            });
        }catch(error){
            console.log("initConnection error catch" , skuId , error );
          this.onInitRequestPurchaseError(error); 
        }
    }

    onInitRequestPurchaseError( error ){
        paymentEvents.emit(paymentEventsMap.paymentIAPError); 
        Alert.alert("", ostErrors.getUIErrorMessage("init_iap_payment"));
    }

    onRequestPurchaseError(error , userId ){
        console.log("onRequestPurchaseError" , error , userId );
        paymentEvents.emit(paymentEventsMap.paymentIAPError); 
        if(error && error.responseCode !== 2){
            Toast.show({
                text:  ostErrors.getUIErrorMessage("payment_failed_error"),
                icon: 'error'
            });
        }   
    }

    onRequestPurchaseSuccess( res , userId ){
        console.log("onRequestPurchaseSuccess" , res , userId );
        const params = UserPayments.getBEAcknowledgeData( userId , res ); 
        // Add to Async immediately 
        UserPayments.addPendingPaymentForBEAcknowledge(params);
         //Sync with Backend
        new BackendPaymentAcknowledge( params ); 
        //Convey others payment is processed irrespective of status 
        paymentEvents.emit(paymentEventsMap.paymentIAPSuccess);
    }

    snycPendingPayments( userId ){

        let shouldCheckForPendingTopUps = true;

        //Sync BE pending payments 
        UserPayments.getPendingPaymentsForBEAcknowledge( userId ).then((payments) => {
            console.log("getPendingPaymentsForBEAcknowledge" , payments , userId );
            payments = Utilities.getParsedData( payments );
            for (var key in payments) {
                shouldCheckForPendingTopUps =  false;
                new BackendPaymentAcknowledge( payments[key] , true ); 
            } 
        });

        //Sync native store pending payments 
        UserPayments.getPendingPaymentsForStoreAcknowledge( userId ).then((topEntities) => {
            console.log("getPendingPaymentsForStoreAcknowledge" , topEntities , userId );
            topEntities = Utilities.getParsedData( topEntities );
            for (var key in topEntities) {
                new NativeStoreAcknowledge( topEntities[key] , true ); 
            } 
        });
         
         //if( shouldCheckForPendingTopUps ){ 
            PollCurrentUserPendingPayments.initBalancePoll(userId ,  true);
        // }
        
    }

}

export default new StorePayments(); 

/**
 * Private class implementation start
 */

class BackendPaymentAcknowledge {

    constructor( payment , isBackgroundSync){
        if(!payment) return null;
        this.payment = payment ;
        this.isBackgroundSync = !!isBackgroundSync;
        this.pollInterval = 10000;
        this.count = 0 ;
        this.pepoApi = new PepoApi(paymentAcknowledgeApi)
        this.beAcknowledge();
    }

    beAcknowledge( ){
        //Check if the logined user is same as the user made the transaction 
        if( !this.payment || this.payment.user_id != CurrentUser.getUserId() ) return ;
        this.pepoApi
        .post(this.payment)
        .then(( res )=> {
            if(res && res.success ){
                this.onBEAcknowdledgeSuccess(res ); 
            }else{
                this.onBEAcknowdledgeError(res );
            }   
        })
        .catch((error)=> {
            this.onBEAcknowdledgeError(error );
        }); 
    }

    onBEAcknowdledgeSuccess(res){
        console.log("onBEAcknowdledgeSuccess" , res  , this.payment );
        let resultType = deepGet(res ,  "data.result_type")
            topUpEntity = deepGet(res,  `data.${resultType}`) || {} , 
            isStartPolling = topUpEntity[dataContract.payments.startPollingKey], 
            errMsg = topUpEntity[dataContract.payments.paymentAcknowledgeErrMsgKey]
            ; 

         //Add for pending apple or google acknowledge 
         UserPayments.addPendingPaymentForStoreAcknowledge(this.payment , topUpEntity ); 
         //Remove the entry from async 
         UserPayments.removePendingPaymentForBEAcknowledge( this.payment );
         //Emit evnt 
         paymentEvents.emit(paymentEventsMap.paymentBESyncSuccess, {isBackgroundSync: this.isBackgroundSync , topUpEntity :topUpEntity });
          //Start native store acknowledge 
         new NativeStoreAcknowledge( UserPayments.getNativeStoreData(this.payment , topUpEntity ) ) ; 

        if( isStartPolling == 1 ){
            //Start long poll for user 
            PollCurrentUserPendingPayments.initBalancePoll(this.payment.user_id);
        } else if( errMsg ){
            //Notify user that he needs to get in touch with Apple of Google store
            Alert.alert("", errMsg );
        }   
    }

    onBEAcknowdledgeError(error ){
        console.log("onBEAcknowdledgeError" , error  , this.payment );
        this.count++ ;
        if(this.count < maxRetryCount ){
            setTimeout( () => {
                this.beAcknowledge();
            } , this.pollInterval  )       
        }else {
            this.inAppError( error ); 
        }
    }

    inAppError( error ){
        !this.isBackgroundSync && Alert.alert("", ostErrors.getUIErrorMessage("payment_acknowledge_to_be"));  
        paymentEvents.emit(paymentEventsMap.paymentBESyncFailed , {isBackgroundSync: this.isBackgroundSync}) ; 
    }
}

class NativeStoreAcknowledge{

    constructor(storeEntity , isBackgroundSync) {
        this.storeEntity =  storeEntity || {}; 
        this.topUpId = deepGet(this.storeEntity , `topUpEntity.${topUpIdKey}`);       
        this.userId = deepGet(this.storeEntity , `paymentEntity.user_id`); 
        this.isBackgroundSync = isBackgroundSync ;
        this.pollInterval = 10000;
        this.count = 0 ;
        this.pepoApi = new PepoApi(topUpStatusApi+this.topUpId)
        paymentEvents.emit(paymentEventsMap.paymentStoreSyncStarted,  { isBackgroundSync : this.isBackgroundSync });
        this.storeSync();   
    }

    storeSync(){
        if(!this.topUpId || this.userId != CurrentUser.getUserId() )  return;
        this.pepoApi
        .get()
        .then((res)=> {
            if(res && res.success){
                this.storeSyncSuccess(res);
            }else{
                this.storeSyncError(res);
            }
        })
        .catch((error)=> {
            this.storeSyncError(error);
        })
    }

    storeSyncError(error){
        console.log("storeSyncError" , error  , this.storeEntity );
        this.count++;
        if(this.count < maxRetryCount ){
            this.storeSync();
        }else{
            paymentEvents.emit(paymentEventsMap.paymentStoreSyncFailed ,  {isBackgroundSync : this.isBackgroundSync});
        }
    }

    storeSyncSuccess(res){
        console.log("storeSyncSuccess" , res  , this.storeEntity );
        let resultType = deepGet(res ,  "data.result_type")
        topUpEntity = deepGet(res,  `data.${resultType}`) || {} , 
        isConsumable = topUpEntity[dataContract.payments.isConsumableKey] 
        ; 
        if( isConsumable == 1 ){
            //Reset the error count
            this.count = 0 ; 
            this.nativeStoreSync();
        }
    }

    nativeStoreSync(){
        if(Platform.OS == "ios") {
            RNIap.clearTransactionIOS(); //Not sure whether to do this or not.
            this.nativeStoreSyncSuccess();
        } else if(Platform.OS == "android"){
            try {
                const purchaseToken = deepGet(this.storeEntity ,  "paymentEntity.purchaseToken"); 
                RNIap.consumePurchaseAndroid(purchaseToken).then((res)=> {
                    this.nativeStoreSyncSuccess(res);
                }).catch((error)=> {
                    this.nativeStoreSyncError( error); 
                })
            }catch(error){
                this.nativeStoreSyncError( error ); 
            }
        }
    }

    nativeStoreSyncSuccess(res){
      console.log("nativeStoreSyncSuccess" , res  , this.storeEntity );
      UserPayments.removePendingPaymentForStoreAcknowledge(this.storeEntity);
      paymentEvents.emit(paymentEventsMap.paymentStoreSyncSuccess ,  {isBackgroundSync : this.isBackgroundSync}); 
    }   

    nativeStoreSyncError(error ){
        console.log("nativeStoreSyncError" , error  , this.storeEntity );
        paymentEvents.emit(paymentEventsMap.paymentStoreSyncFailed ,  {isBackgroundSync : this.isBackgroundSync});
         //Not sure whether its a good idea.
        // this.count++ ; 
        // if(this.count < maxRetryCount ){
        //     // this.nativeStoreSync(); 
        // }else{
           
        // }
    }

}

/**
 * Private class implementation end
 */