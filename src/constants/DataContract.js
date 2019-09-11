export default {

    payments: {
        postPaymentAcknowledgeApi : "/payments/confirm-pay-receipt", 
        getAllProductsApi : '/users/available-products' , 
        getTopUpStatusApi : "/users/topup/",
        purchaseThresholdReachedKey : "limits_data",
        topUpEntityId : "id",
        startPollingKey : "start_polling",
        paymentAcknowledgeErrMsgKey :"err_message",
        isConsumableKey: "is_consumable"
    },

    common: {
        resultType : "data.result_type"
    }
}

