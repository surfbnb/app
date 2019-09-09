import {Alert , Platform} from "react-native";
import Toast from '../theme/components/NotificationToast';

import  { paymentEvents,  paymentEventsMap } from "../helpers/PaymentEvents";
import RNIap from 'react-native-iap';
import deepGet from "lodash/get";
import PepoApi from "../services/PepoApi";
import UserPayments from "../models/UserPayments";
import CurrentUser from "../models/CurrentUser";
import PollCurrentUserPendingPayments from "../helpers/PollCurrentUserPendingPayments";
import Utilities from "./Utilities";
import {ostErrors} from "../services/OstErrors";
import appConfig from "../constants/AppConfig";

const maxRetryCount = 10 ;
const paymentAcknowledgeApi = "/payments/confirm-pay-receipt" ; 
const topUpStatusApi = "user"; //TODO 
const topUpIdKey = "top_up_id"

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
            RNIap.initConnection().then((res)=> {
                RNIap.requestPurchase(skuId);
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
        paymentEvents.emit(paymentEventsMap.paymentIAPError); 
        if(error && error.errorCode !== 2){ //TODO Confrim Error code
            Toast.show({
                text:  ostErrors.getUIErrorMessage("payment_failed_error"),
                icon: 'error'
            });
        }   
    }

    onRequestPurchaseSuccess( res , userId ){
        const params = UserPayments.getBEAcknowledgeData( userId , res ); 
        // Add to Async immediately 
        UserPayments.addPendingPaymentForBEAcknowledge(params);
         //Sync with Backend
        new BackendPaymentAcknowledge( params ); 
        //Convey others payment is processed irrespective of status 
        paymentEvents.emit(paymentEventsMap.paymentIAPSuccess);
    }

    snycPendingPayments( userId ){

        let shouldCheckForPendingTopUps = false ;

        //Sync BE pending payments 
        UserPayments.getPendingPaymentsForBEAcknowledge( userId ).then((payments) => {
            payments = Utilities.getParsedData( payments );
            for (var key in payments) {
                shouldCheckForPendingTopUps =  true ;
                new BackendPaymentAcknowledge( payments[key] , true ); 
            } 
        });

        //Sync native store pending payments 
        UserPayments.getPendingPaymentsForStoreAcknowledge( userId ).then((topEntities) => {
            topEntities = Utilities.getParsedData( topEntities );
            for (var key in topEntities) {
                new NativeStoreAcknowledge( topEntities[key] , true ); 
            } 
        });
         
         if( shouldCheckForPendingTopUps ){
            PollCurrentUserPendingPayments.initBalancePoll(userId);
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
            status = topUpEntity.status
            ; 
        if( isProcessableTopEntity( status ) ){
            //Add for pending apple or google acknowledge 
            UserPayments.addPendingPaymentForStoreAcknowledge(this.payment , topUpEntity ); 
            //Remove the entry from async 
            UserPayments.removePendingPaymentForBEAcknowledge( this.payment );
            //Emit evnt 
            paymentEvents.emit(paymentEventsMap.paymentBESyncSuccess, {isBackgroundSync: this.isBackgroundSync}) ;
            //Start native store acknowledge 
            new NativeStoreAcknowledge( UserPayments.getNativeStoreData(this.payment , topUpEntity ) ) ; 
            //Start long poll for user 
            PollCurrentUserPendingPayments.initBalancePoll(this.payment.user_id);
        } else if( status == appConfig.topEntityStatusMap.pending ){
            //IF invalid payment remove from async 
            UserPayments.removePendingPaymentForBEAcknowledge( this.payment );
            //Emit success as backend has acknowledged but its an invalid or fraud transaction.
            paymentEvents.emit(paymentEventsMap.paymentBESyncSuccess, {isBackgroundSync: this.isBackgroundSync}) ;
            //Notify user that he needs to get in touch with Apple of Google store
            Alert.alert("", ostErrors.getUIErrorMessage("invalid_payment") );
        }       

    }

    isProcessableTopEntity(status){
        return status == appConfig.topEntityStatusMap.success || status == appConfig.topEntityStatusMap.pending ; 
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
        !this.isBackgroundSync && Alert.alert("", ostErrors.getUIErrorMessage("iap_transaction_done_locally"));  
        paymentEvents.emit(paymentEventsMap.paymentBESyncFailed , {isBackgroundSync: this.isBackgroundSync}) ; 
    }
}

class NativeStoreAcknowledge{

    constructor(storeEntity , isBackgroundSync) {
        this.storeEntity =  storeEntity || {}; 
        this.topUpId = deepGet(this.storeEntity , `topUpEntity.${topUpIdKey}`) ;       
        this.userId = deepGet(this.storeEntity , `paymentEntity.${user_id}`) ;  ;
        if(!this.topUpId || this.userId != CurrentUser.getUserId() )  return null;
        this.isBackgroundSync = isBackgroundSync ;
        this.pollInterval = 10000;
        this.count = 0 ;
        this.pepoApi = new PepoApi(topUpStatusApi);
        paymentEvents.emit(paymentEventsMap.paymentStoreSyncStarted,  { isBackgroundSync : this.isBackgroundSync });
        this.storeSync();   
    }

    storeSync(){
        this.pepoApi
        .get({"top_up_id": this.topUpId })
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

    storeSyncError(){
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
        isConsumable = topUpEntity.is_consumable 
        ; 
        if( isConsumable == 1 ){
            //Reset the error count
            this.count = 0 ; 
            this.nativeStoreSync();
        }
    }

    nativeStoreSync(){
        if(this.userId != CurrentUser.getUserId()) return;
        if(Platform.OS == "ios") {

        } else if(Platform.OS == "android"){
  
        }
    }

    nativeStoreSyncSuccess(){
      UserPayments.removePendingPaymentForStoreAcknowledge(this.storeEntity);
      paymentEvents.emit(paymentEventsMap.paymentStoreSyncSuccess ,  {isBackgroundSync : this.isBackgroundSync}); 
    }   

    nativeStoreSyncError(){
        this.count++ ; 
        if(this.count < maxRetryCount ){
            this.nativeStoreSync();
        }else{
            paymentEvents.emit(paymentEventsMap.paymentStoreSyncFailed ,  {isBackgroundSync : this.isBackgroundSync});
        }
    }

}

/**
 * Private class implementation end
 */