import {Platform} from "react-native";
import deepGet from "lodash/get";

import Utilities from "../services/Utilities";

const userIdKey = "user_id" ;

class UserPayments  {


    getBEAcknowledgeData(userId , res){
        return {
              response : res , 
              os : Platform.OS.toLowerCase(), 
              user_id : userId
          }; 
    }

    addPendingPaymentForBEAcknowledge( payment ) {
        if(!payment) return ;
        let userId = payment[userIdKey],
            transactionId = this.getTransactionId( payment ),
            userPendingPaymentsAsKey = this._getPendingPaymentsForBEAcknowledgeASKey(userId , transactionId  )  ;
        return Utilities.saveItem(userPendingPaymentsAsKey, payment); 
    }

    removePendingPaymentForBEAcknowledge( payment ){
        if(!payment) return ;
        let userId = payment[userIdKey],
            transactionId = this.getTransactionId( payment ),  
            userPendingPaymentsAsKey = this._getPendingPaymentsForBEAcknowledgeASKey(userId, transactionId )  ;
        return Utilities.removeItem( userPendingPaymentsAsKey );
    }

    addPendingPaymentForStoreAcknowledge(paymentEntity , topUpEntity) {
        if(!paymentEntity || !topUpEntity) return ;
        let userId = paymentEntity[userIdKey],
            transactionId = this.getTransactionId( paymentEntity );
            storeEntityIdAsKey = this._getStorePendingTopsUpsKey(userId ,transactionId)  ;
        return Utilities.saveItem(storeEntityIdAsKey,  this.getNativeStoreData( paymentEntity , topUpEntity ) );
    }

    removePendingPaymentForStoreAcknowledge( storeEntity ){
        if(!storeEntity) return ;
        let userId = deepGet(storeEntity,  "paymentEntity.user_id"), 
            transactionId = this.getTransactionId(storeEntity.paymentEntity); 
        storeEntityIdAsKey = this._getStorePendingTopsUpsKey(userId , transactionId)  ;
        return Utilities.removeItem( storeEntityIdAsKey );
    }

    getNativeStoreData(paymentEntity ,  topUpEntity ){
        return {
             paymentEntity : paymentEntity,
             topUpEntity: topUpEntity
         }
     }

    getTransactionId( payment ){
        return deepGet(payment ,  "response.transactionId") ;
    }

    getPendingPaymentsForBEAcknowledgeASKeyPrefix( userId ){
        return 'user-' + userId + "-be-pending-payments";
    }

    _getPendingPaymentsForBEAcknowledgeASKey(userId ,  transactionId ) {
        return `${this.getPendingPaymentsForBEAcknowledgeASKeyPrefix(userId)}-${transactionId}`  ;
    }

    getPendingPaymentsForBEAcknowledge( key ){
        return Utilities.getItem( key );
    }
  
    getPendingPaymentsForStoreAcknowledge( key ){
        return Utilities.getItem(key);
    }

    getStorePendingTopsUpsKeyPrefix(userId){
        return 'user-' + userId + "-store-pending-payments";
    }

    _getStorePendingTopsUpsKey(userId , transactionId){
        return `${this.getStorePendingTopsUpsKeyPrefix( userId )}-${transactionId}`  ;
    }

    getUserIdKey (){
        return userIdKey;
    }

}

export default new UserPayments();