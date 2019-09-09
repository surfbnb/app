import {Platform} from "react-native";
import deepGet from "lodash/get";

import Utilities from "../services/Utilities";

const topIdKey = "top_up_id" ;

class UserPayments  {


    getBEAcknowledgeData(userId , res){
        return {
              response : res , 
              os : Platform.OS.toLowerCase(), 
              user_id : userId
          }; 
    }

    getPendingPaymentsForBEAcknowledge( userId ){
        return Utilities.getItem(this._getPendingPaymentsForBEAcknowledgeASKey( userId ));
    }

    addPendingPaymentForBEAcknowledge( payment ) {
        if(!payment) return ;
        let  userPendingPaymentsAsKey = this._getPendingPaymentsForBEAcknowledgeASKey(  payment && payment.user_id  )  ;
        Utilities.getItem( userPendingPaymentsAsKey ).then((payments)=>{
            payments =  Utilities.getParsedData(payments) ;
            let transactionId = this.getTransactionId( payment );
            payments[transactionId] = payment ; 
            Utilities.saveItem(userPendingPaymentsAsKey, payments);
        }); 
    }

    removePendingPaymentForBEAcknowledge( payment ){
        if(!payment) return ;
        let  userPendingPaymentsAsKey = this._getPendingPaymentsForBEAcknowledgeASKey(  payment && payment.user_id  )  ;
        Utilities.getItem( userPendingPaymentsAsKey ).then((payments)=>{
            payments =  Utilities.getParsedData(payments) ;
            let transactionId = this.getTransactionId( payment );
            delete payments[transactionId]; 
            Utilities.saveItem(userPendingPaymentsAsKey, payments);
        }); 
    }

    getTransactionId( payment ){
        return deepGet(payment ,  "response.transactionId") ;
    }

    _getPendingPaymentsForBEAcknowledgeASKey(userId) {
        return 'user-' + userId + "be-pending-payments";
    }

    getNativeStoreData(paymentEntity ,  topUpEntity ){
       return {
            paymentEntity : paymentEntity,
            topUpEntity: topUpEntity
        }
    }

    getPendingPaymentsForStoreAcknowledge( userId ){
        return Utilities.getItem(this._getStorePendingTopsUpsKey( userId ));
    }

    addPendingPaymentForStoreAcknowledge(paymentEntity , topUpEntity) {
        if(!paymentEntity || !topUpEntity) return ;
        let storeEntityIdAsKey = this.getPendingPaymentsForStoreAcknowledge( paymentEntity && paymentEntity.user_id  )  ;
        Utilities.getItem( storeEntityIdAsKey ).then((storeEntities)=>{
            storeEntities =  Utilities.getParsedData(storeEntities) ;
            let transactionId = this.getTransactionId( paymentEntity );
            storeEntities[transactionId] = this.getNativeStoreData( paymentEntity , topUpEntity ) ;
            Utilities.saveItem(storeEntityIdAsKey, storeEntities);
        }); 
    }

    removePendingPaymentForStoreAcknowledge( storeEntity ){
        if(storeEntity) return ;
        let userId = deepGet(storeEntity,  "paymentEntity.user_id")
        storeEntityIdAsKey = this.getPendingPaymentsForStoreAcknowledge(userId)  ;
        Utilities.getItem( storeEntityIdAsKey ).then((storeEntities)=>{
            storeEntities =  Utilities.getParsedData(storeEntities) ;
            let transactionId = this.getTransactionId( storeEntities.paymentEntity );
            delete storeEntities[transactionId]; 
            Utilities.saveItem(storeEntityIdAsKey, storeEntities);
        }); 
    }

    _getStorePendingTopsUpsKey(userId){
        return 'user-' + userId + "store-pending-payments";
    }

}

export default new UserPayments();