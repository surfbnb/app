import {Alert} from "react-native"
import deepGet from "lodash/get";
import CurrentUser from "../models/CurrentUser";
import PepoApi from "../services/PepoApi"; 
import Pricer from "../services/Pricer";
import  { paymentEvents,  paymentEventsMap } from "../helpers/PaymentEvents";
import appConfig from "../constants/AppConfig";
import ostErrors from "../services/OstErrors";
import dataContract from "../constants/DataContract";

let errorMaxCount = 10 ,  errorCount = 0 ,  pollingTimeOut = 0 ,  pollingInterval = 10000  , 
      maxPollDuration = 300000; pollDuration = 0 ;   
      
class PollCurrentUserPendingPayments {

    constructor(){
        this.isPolling = false ;
    }

    initBalancePoll( userId ,  isBackgroundSync ){ 
        this.userId = userId ;
        this.isBackgroundSync = !!isBackgroundSync; 
        this.startPolling();
    }

    startPolling( ){
        pollDuration = 0;  
        this.isPolling = true ;
        this.schedulePoll(1);
        paymentEvents.emit(paymentEventsMap.pollPendingPaymentsStart  , {isBackgroundSync: this.isBackgroundSync});
    }

    schedulePoll( pInterval ){
        pInterval =  pInterval || pollingInterval ;
        clearTimeout( pollingTimeOut ); 
        if( maxPollDuration < pollDuration) {
           this.showAlert( appConfig.paymentFlowMessages.transactionPending); 
           this.stopPolling( paymentEventsMap.pollPendingPaymentsSuccess ,  {isBackgroundSync: this.isBackgroundSync,  status: "pending"} ) ; 
           return;
        } 
        pollingTimeOut =  setTimeout( () => {
            this.fetchPendingPayments();
        },  pInterval ) ;
    }

    fetchPendingPayments(){
        //Payment of user and login user are not same dont poll and reset the error count
        if( this.userId != CurrentUser.getUserId() ) {
            errorCount = 0;   
            return
        } ; 
        new PepoApi(dataContract.payments.getPendingApi).get()
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
        const   resultType = deepGet( res , dataContract.common.resultType),
                pendingTransactions = deepGet( res , `data.${resultType}`) || [] ;
        //If all pending Payments are resolved fetch balance 
        if(  pendingTransactions.length == 0 ){
            Pricer.getBalance(); 
            this.stopPolling( paymentEventsMap.pollPendingPaymentsSuccess ,  {isBackgroundSync: this.isBackgroundSync} ) ; 
            this.showAlert( appConfig.paymentFlowMessages.transactionSuccess ); 
        //Else keep polling    
        }else{
            this.schedulePoll();
        }
        this.errorCount = 0 ;
    }

    onPendingPaymentError(error){
        errorCount++ 
        if( errorCount < errorMaxCount ){
            this.schedulePoll();
        }else{
            this.showAlert(ostErrors.getUIErrorMessage("pending_transaction_poll")) ;
            console.log("onPendingPaymentError max reached" , error  ,CurrentUser.getUserId() );
            this.stopPolling( paymentEventsMap.pollPendingPaymentsError ,  {isBackgroundSync: this.isBackgroundSync} ) ; 
        }
    }

    stopPolling(event ,  payload ){
        event && paymentEvents.emit(event , payload);
        this.isPolling = false ;
    }

    getPollingStatus(){
        return this.isPolling;
    }

    showAlert( msg ,  header=""){
        if(!this.isBackgroundSync){
            msg && Alert.alert("" ,msg);
        }
    }
    
}

export default new PollCurrentUserPendingPayments();