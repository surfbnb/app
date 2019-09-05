import deepGet from "lodash/get";

import CurrentUser from "../models/CurrentUser";
import PepoApi from "../services/PepoApi"; 
import Pricer from "../services/Pricer";

const errorMaxCount = 5 ,  errorCount = 0 ,  pollingTimeOut = 0 ,  pollingInterval = 10000 ;

class PollCurrentUserPendingPayments {

    constructor(){
        this.pepoApi = new PepoApi("/top-up/pending") ; 
    }

    initBalancePoll( userId ){ 
        this.userId = userId ;
        this.schedulePoll();
    }

    schedulePoll( ){
        clearTimeout( pollingTimeOut );   
        pollingTimeOut =  setTimeout( () => {
            this.fetchPendingPayments();
        },  pollingInterval )
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
        })

    }

    onPendingPaymentSuccess( res ){
        const pendingTransactions = deepGet( res , `data.${res.result_type}`) || [] ;
        //If all pending Payments are resolved fetch balance 
        if(  pendingTransactions.length ==  0 ){
            Pricer.getBalance(); 
        //Else keep polling    
        }else{
            this.schedulePoll();
        }
    }

    onPendingPaymentError(error){
        errorCount++ 
        if( errorCount < errorMaxCount ){
            this.schedulePoll();
        }
    }
    
}

export default new PollCurrentUserPendingPayments();