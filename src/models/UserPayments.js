import {Platform} from "react-native";
import deepGet from "lodash/get";

import Utilities from "../services/Utilities";

class UserPayments  {


    getBEAcknowledgeData(userId , res){
        return {
              response : res , 
              os : Platform.OS.toLowerCase(), 
              user_id : userId
          }; 
    }

    getPendingUserPaymentsFromAsync( userId ){
        return Utilities.getItem(this._getUserPendingPaymentsASKey( userId ));
    }

    addUserPaymentFromAsync( params ) {
        if(!params) return ;
        let  userPendingPaymentsAsKey = this._getUserPendingPaymentsASKey(  params && params.user_id  )  ;
        Utilities.getItem( userPendingPaymentsAsKey ).then((payments)=>{
            payments =  Utilities.getParsedData(payments) ;
            let transactionId = this.getTransactionId( params );
            payments[transactionId] = params ; 
            Utilities.saveItem(userPendingPaymentsAsKey, payments);
        }); 
    }

    removeUserPaymentFromAsync( params ){
        if(!params) return ;
        let  userPendingPaymentsAsKey = this._getUserPendingPaymentsASKey(  params && params.user_id  )  ;
        Utilities.getItem( userPendingPaymentsAsKey ).then((payments)=>{
            payments =  Utilities.getParsedData(payments) ;
            let transactionId = this.getTransactionId( params );
            delete payments[transactionId]; 
            Utilities.saveItem(userPendingPaymentsAsKey, payments);
        }); 
    }

    getTransactionId( params ){
        return deepGet(params ,  "response.transactionId") ;
    }

    _getUserPendingPaymentsASKey(userId) {
        return 'user-' + userId + "pending-payments";
    }

}

export default new UserPayments();