import {Alert , Platform} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import RNIap from 'react-native-iap';
import deepGet from "lodash/get";
import  { paymentEvents,  paymentEventsMap } from "../helpers/PaymentEvents";
import PepoApi from "../services/PepoApi";
import userPayments from "../models/UserPayments";
import CurrentUser from "../models/CurrentUser";
import PollCurrentUserPendingPayments from "../helpers/PollCurrentUserPendingPayments";
import Utilities from "./Utilities";
import {ostErrors} from "../services/OstErrors";
import dataContract from "../constants/DataContract"; 

const maxRetryCount = 10 ;
const paymentAcknowledgeApi = dataContract.payments.postPaymentAcknowledgeApi ; 
const topUpStatusApi = dataContract.payments.getTopUpStatusApi; 
const topUpIdKey = dataContract.payments.topUpEntityId

class StorePayments {

    getProductsFromStore(itemSkus ,  successCallback ,  errorCallback ){
        try {
            RNIap.getProducts(itemSkus).then(( products ) => {
                successCallback && successCallback( products );
            }).catch(( error )=> {
                errorCallback && errorCallback( error );
            });
          } catch(error) {
            errorCallback && errorCallback( error );  
        }
    }

    //@Note : Success and error will be subscribtion based
    requestPurchase( skuId ){
        try {
            //RNIap.clearTransactionIOS(); This method has been deprecated
            RNIap.initConnection().then((res)=> {
                RNIap.requestPurchase(skuId , false)
                .catch((err)=> {});
            }).catch((error)=> {
                this.onInitRequestPurchaseError(error); 
            });
        }catch(error){
          this.onInitRequestPurchaseError(error); 
        }
    }

    onInitRequestPurchaseError( error ){
        paymentEvents.emit(paymentEventsMap.paymentIAPError); 
        Alert.alert("", ostErrors.getUIErrorMessage("init_iap_payment"));
    }

    onRequestPurchaseError(error , userId ){
        error = error || {};
        paymentEvents.emit(paymentEventsMap.paymentIAPError); 
        Alert.alert("" , ostErrors.getUIErrorMessage("payment_failed_error"));   
    }

    onRequestPurchaseSuccess( res , userId ){
        const  params = userPayments.getBEAcknowledgeData( userId , res ) ; 
        // Add to Async immediately 
        userPayments.addPendingPaymentForBEAcknowledge(params);
         //Sync with Backend
        new BackendPaymentAcknowledge( params , false ); 
        //Convey others payment is processed irrespective of status 
        paymentEvents.emit(paymentEventsMap.paymentIAPSuccess);
    }

    snycPendingPayments( userId ){
        const beAcknowledgeData = [], nativeAcknowledgeData = []   ;
    
         AsyncStorage.getAllKeys()
        .then((keys) => {
            if(!keys) return;
            for(let cnt = 0 ;  cnt < keys.length ; cnt++ ){
                let currentKey = keys[cnt]; 
                if(currentKey.indexOf( userPayments.getPendingPaymentsForBEAcknowledgeASKeyPrefix( userId )) > -1 ){
                    beAcknowledgeData.push( currentKey );
                }else if(currentKey.indexOf( userPayments.getStorePendingTopsUpsKeyPrefix( userId ))> -1) {
                    nativeAcknowledgeData.push( currentKey );
                }
           }
           //Sync BE pending payments 
           this.__syncBETransactions( beAcknowledgeData );
           //Sync native store pending payments
           this.__syncNativeStoreTransactions( nativeAcknowledgeData );
        }).catch((error)=> {
            console.log("snycPendingPayments getAllKeys" , error);
        });

        if(CurrentUser.isUserActivated()){
            PollCurrentUserPendingPayments.initBalancePoll(userId ,  true);    
        }
       
    }

    __syncBETransactions( list ){
        for( let cnt = 0 ;  cnt< list.length ; cnt++ ){
            userPayments.getPendingPaymentsForBEAcknowledge( list[cnt] ).then((payment) => {
                    payment =  Utilities.getParsedData( payment );
                    new BackendPaymentAcknowledge( payment, true ); 
            });    
        }
    }

    __syncNativeStoreTransactions( list ){
        for( let cnt = 0 ;  cnt< list.length ; cnt++ ){
            userPayments.getPendingPaymentsForStoreAcknowledge( list[cnt] ).then((storeEntity) => {
                    storeEntity =  Utilities.getParsedData( storeEntity );
                    new NativeStoreAcknowledge( storeEntity, true ); 
            });    
        }
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
        let resultType = deepGet(res ,  "data.result_type")
            topUpEntity = deepGet(res,  `data.${resultType}`) || {} , 
            isStartPolling = topUpEntity[dataContract.payments.startPollingKey], 
            status  = topUpEntity[dataContract.payments.statusCodeBEAcknowledgeKey]
            ; 

         //Add for pending apple or google acknowledge 
         userPayments.addPendingPaymentForStoreAcknowledge(this.payment , topUpEntity )
            .then(()=> {
                 //Remove the entry from async   
                userPayments.removePendingPaymentForBEAcknowledge( this.payment );
            }).catch(()=>{
                console.log("addPendingPaymentForStoreAcknowledge failed");
            }); 
        
         //Emit evnt 
         paymentEvents.emit(paymentEventsMap.paymentBESyncSuccess, {isBackgroundSync: this.isBackgroundSync , topUpEntity :topUpEntity });
          //Start native store acknowledge 
         new NativeStoreAcknowledge( userPayments.getNativeStoreData(this.payment , topUpEntity ) ) ; 

        if( isStartPolling == 1 ){
            //Start long poll for user 
            PollCurrentUserPendingPayments.initBalancePoll(this.payment.user_id , this.isBackgroundSync);
        } else {
            //Notify user that he needs to get in touch with Apple of Google store
            paymentEvents.emit(paymentEventsMap.stopLoader, {isBackgroundSync: this.isBackgroundSync});
            if( status == dataContract.payments.statusCodeBEAcknowledgeMap.failed ){
                Alert.alert("", ostErrors.getUIErrorMessage("payment_invalid") );
            }else if(status == dataContract.payments.statusCodeBEAcknowledgeMap.processing ) {
                Alert.alert("", ostErrors.getUIErrorMessage("payment_pending") );
            }else if(status == dataContract.payments.statusCodeBEAcknowledgeMap.cancelled ) {
                Alert.alert("", ostErrors.getUIErrorMessage("payment_cancelled") );
            }
        }   
    }

    onBEAcknowdledgeError(error ){
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
        .get({
            "transaction_id"  : deepGet(this.storeEntity , "paymentEntity.response.transactionId")
        })
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
        this.count++;
        if(this.count < maxRetryCount ){
            this.storeSync();
        }else{
            paymentEvents.emit(paymentEventsMap.paymentStoreSyncFailed ,  {isBackgroundSync : this.isBackgroundSync});
        }
    }

    storeSyncSuccess(res){
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

    async nativeStoreSync(){
        try {
            let purchaseToken = deepGet(this.storeEntity ,  "paymentEntity.response.purchaseToken") ,
                isConsumed =  true;     
            RNIap.getAvailablePurchases().then((purchases)=> {
                purchases.forEach(purchase => {
                    if( purchaseToken == purchase.purchaseToken  ){
                        isConsumed =  false ;
                        if(Platform.OS == "ios") {
                            this.iOsConsumtion( purchase );
                         } else if(Platform.OS == "android"){
                            this.androidConsumtion( purchase );
                         }
                    }  
                });
                if( isConsumed ){
                    this.nativeStoreSyncSuccess();
                }
            });   
        }catch(error){
            this.nativeStoreSyncError( error ); 
        }
    }

    iOsConsumtion( purchase ){
        RNIap.finishTransactionIOS(purchase.transactionId).then((res)=> {
            this.nativeStoreSyncSuccess();
        }).catch((error)=> {
           console.log("==nativeStoreSync== error" , error); 
        })
    }

    androidConsumtion( purchase){
        RNIap.consumePurchaseAndroid(purchase.purchaseToken).then((res)=> {
            this.nativeStoreSyncSuccess();
        }).catch((error)=> {
           console.log("==nativeStoreSync== error" , error); 
        });
    }

    nativeStoreSyncSuccess(){
      userPayments.removePendingPaymentForStoreAcknowledge(this.storeEntity);
      paymentEvents.emit(paymentEventsMap.paymentStoreSyncSuccess ,  {isBackgroundSync : this.isBackgroundSync}); 
    }   

    nativeStoreSyncError(error ){
        paymentEvents.emit(paymentEventsMap.paymentStoreSyncFailed ,  {isBackgroundSync : this.isBackgroundSync});
    }

}

/**
 * Private class implementation end
 */