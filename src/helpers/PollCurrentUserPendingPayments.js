import {Alert} from "react-native"
import deepGet from "lodash/get";
import CurrentUser from "../models/CurrentUser";
import PepoApi from "../services/PepoApi"; 
import Pricer from "../services/Pricer";
import  { paymentEvents,  paymentEventsMap } from "../helpers/PaymentEvents";
import appConfig from "../constants/AppConfig";
import ostErrors from "../services/OstErrors";

let errorMaxCount = 10 ,  errorCount = 0 ,  pollingTimeOut = 0 ,  pollingInterval = 10000  , 
      maxPollDuration = 300000; pollDuration = 0 ;   
      
//TODO remove all console.logs      

class PollCurrentUserPendingPayments {

    initBalancePoll( userId ,  isBackgroundSync ){ 
        this.userId = userId ;
        this.isBackgroundSync = !!isBackgroundSync; 
        pollDuration = 0;
        this.schedulePoll();
        paymentEvents.emit(paymentEventsMap.pollPendingPaymentsStart , {isBackgroundSync: this.isBackgroundSync} ); 
        console.log("initBalancePoll" , userId  ,isBackgroundSync );
    }

    schedulePoll( ){
        clearTimeout( pollingTimeOut ); 
        if( maxPollDuration < pollDuration) {
            console.log("schedulePoll maxPollDuration" , maxPollDuration  ,pollDuration );
            if(!this.isBackgroundSync ){
                Alert.alert("" , appConfig.paymentFlowMessages.transactionPending);
            }      
           paymentEvents.emit(paymentEventsMap.pollPendingPaymentsSuccess , {isBackgroundSync: this.isBackgroundSync , status: "pending"} ); 
           return;
        } 
        pollingTimeOut =  setTimeout( () => {
            this.fetchPendingPayments();
        },  pollingInterval ) ;
    }

    fetchPendingPayments(){
        //Payment of user and login user are not same dont poll and reset the error count
        if( this.userId != CurrentUser.getUserId() ) {
            errorCount = 0;   
            return
        } ; 
        new PepoApi(`/${this.userId}/pending-topups`).get()
        .then((res)=> {
            if(res&& res.success){
                this.onPendingPaymentSuccess(res); 
            }else{
                this.onPendingPaymentError(res);
            }
        }).catch(()=> {
            this.onPendingPaymentError(error);
        }).finally( () => {
            pollDuration + pollingInterval;
        })

    }

    onPendingPaymentSuccess( res ){
        console.log("onPendingPaymentSuccess" , res  ,CurrentUser.getUserId() );
        const pendingTransactions = deepGet( res , `data.${res.result_type}`) || [] ;
        //If all pending Payments are resolved fetch balance 
        if(  pendingTransactions.length == 0 ){
            Pricer.getBalance(); 
            paymentEvents.emit(paymentEventsMap.pollPendingPaymentsSuccess , {isBackgroundSync: this.isBackgroundSync}); 
            Alert.alert("" , appConfig.paymentFlowMessages.transactionSuccess);
        //Else keep polling    
        }else{
            this.schedulePoll();
        }
        this.errorCount = 0 ;
    }

    onPendingPaymentError(error){
        console.log("onPendingPaymentError" , error  ,CurrentUser.getUserId() );
        errorCount++ 
        if( errorCount < errorMaxCount ){
            this.schedulePoll();
        }else{
            if(!this.isBackgroundSync){
                Alert.alert("" , ostErrors.getUIErrorMessage("pending_transaction_poll"));
            }
            console.log("onPendingPaymentError max reached" , error  ,CurrentUser.getUserId() );
            paymentEvents.emit(paymentEventsMap.pollPendingPaymentsError , {isBackgroundSync: this.isBackgroundSync} ); 
        }
    }
    
}

export default new PollCurrentUserPendingPayments();