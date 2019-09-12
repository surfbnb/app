export default {

    payments: {
        postPaymentAcknowledgeApi : "/top-up/", 
        getAllProductsApi : '/top-up/products' , 
        getTopUpStatusApi : "/top-up/",
        getPendingApi: "/top-up/pending",
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

