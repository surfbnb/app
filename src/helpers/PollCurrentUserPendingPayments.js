import deepGet from "lodash/get";
import CurrentUser from "../models/CurrentUser";
import PepoApi from "../services/PepoApi"; 
import Pricer from "../services/Pricer";
import  { paymentEvents,  paymentEventsMap } from "../helpers/PaymentEvents";

const errorMaxCount = 10 ,  errorCount = 0 ,  pollingTimeOut = 0 ,  pollingInterval = 10000  , 
      maxPollDuration = 600000; pollDuration = 0 ; 

class PollCurrentUserPendingPayments {

    constructor(){
        this.pepoApi = new PepoApi("/top-up/pending") ; 
    }

    initBalancePoll( userId ){ 
        this.userId = userId ;
        pollDuration = 0;
        this.schedulePoll();
        paymentEvents.emit(paymentEvents.pollPendingPaymentsStart); 
    }

    schedulePoll( ){
        clearTimeout( pollingTimeOut ); 
        if( maxPollDuration < pollDuration || errorCount > errorMaxCount ) {
           return;
        } 
        pollingTimeOut =  setTimeout( () => {
            this.fetchPendingPayments();
        },  pollingInterval ) ;
    }

    fetchPendingPayments(  ){
        //Payment of user and login user are not same dont poll and reset the error count
        if( this.userId != CurrentUser.getUserId() ) {
            errorCount = 0;   
            return
        } ; 
        this.pepoApi.get()
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
        const pendingTransactions = deepGet( res , `data.${res.result_type}`) || [] ;
        //If all pending Payments are resolved fetch balance 
        if(  pendingTransactions.length == 0 ){
            Pricer.getBalance(); 
            paymentEvents.emit(paymentEvents.pollPendingPaymentsSuccess); 
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
            paymentEvents.emit(paymentEvents.pollPendingPaymentsError); 
        }
    }
    
}

export default new PollCurrentUserPendingPayments();