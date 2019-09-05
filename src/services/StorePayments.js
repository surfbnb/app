import EventEmitter from "eventemitter3";
import RNIap from 'react-native-iap';
import Store from '../store';
import {updateIsPurchase} from "../actions";

import PepoApi from "../services/PepoApi";
import UserPayments from "../models/UserPayments";
import CurrentUser from "../models/CurrentUser";
import PollCurrentUserPendingPayments from "../helpers/PollCurrentUserPendingPayments";
import Utilities from "./Utilities";

const maxRetryCount = 5 ;

class StorePayments {

    constructor(){
        this.events = new EventEmitter();
    }

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
    requestPurchase( skuId , errorCallback ){
        try {
            RNIap.requestPurchase(skuId);
        }catch(error){
            errorCallback && errorCallback(error);
        }
    }

    acknowledgeBEOnPurchaseError(error , userId ){
        new PepoApi("/top-up")
        .post(UserPayments.getBEAcknowledgeData( userId , error))
        //Convey others that payment is processed irrespective of status 
        this.events.emit("paymentProcessed"); 
    }

    acknowledgeBEOnPurchaseSuccess( res , userId ){
        const params = UserPayments.getBEAcknowledgeData( userId , res ); 
        // Add to Async immediately 
        UserPayments.addUserPaymentFromAsync(params);
         //Sync with Backend
        new BackendPaymentAcknowledge( params ).acknowledgeBEOnPurchaseSuccess( ); 
        //Convey others payment is processed irrespective of status 
        this.events.emit("paymentProcessed"); 
        //Update the payment status in Redux; 
        Store.dispatch(updateIsPurchase(true));
    }

    snycPendingPayments( userId ){
        UserPayments.getPendingUserPaymentsFromAsync( userId ).then((payments) => {
            payments = Utilities.getParsedData( payments );
            for (var key in payments) {
                new BackendPaymentAcknowledge( payments[key] ).acknowledgeBEOnPurchaseSuccess( ); 
            } 
        });
    }

}

export default new StorePayments(); 

/**
 * Private class implementation start
 */

class BackendPaymentAcknowledge {

    constructor( params ){
        this.params = params;
        this.pollInterval = 10000;
        this.count = 0 ;
    }

    acknowledgeBEOnPurchaseSuccess( ){
        //Check if the logined user is same as the user made the transaction 
        if( !this.params || this.params.user_id != CurrentUser.getUserId() ) return ;
        new PepoApi("/top-up")
        .post(this.params)
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
        //TODO time to let Native google and android know that we have successfully consumed the recipt.
        //Some code 

        //Remove the entry from async 
        UserPayments.removeUserPaymentFromAsync( this.params );

        //Start long poll for user 
        PollCurrentUserPendingPayments.initBalancePoll(this.params.user_id)
    }

    onBEAcknowdledgeError(error ){
        this.count++ ;
        if(this.count < maxRetryCount ){
            setTimeout( () => {
                this.acknowledgeBEOnPurchaseSuccess();
            } , this.pollInterval  )       
        }
    }
}

/**
 * Private class implementation end
 */