export default {

    payments: {
        postPaymentAcknowledgeApi : "/top-up/", 
        getAllProductsApi : '/top-up/products' , 
        getTopUpStatusApi : "/top-up/",
        getPendingApi: "/top-up/pending",
        purchaseThresholdReachedKeyPath : "data.topup_limits_data.limit_reached",
        purchaseThresholdValueKeyPath: "data.topup_limits_data.limit",
        topUpEntityId : "id",
        startPollingKey : "start_polling",
        paymentAcknowledgeErrMsgKey :"err_message",
        statusCodeBEAcknowledgeKey : "display_status", 
        statusCodeBEAcknowledgeMap : {
            failed : "FAILED",
            processing : "PROCESSING",
            cancelled: "CANCELLED"
        },
        isConsumableKey: "is_consumable"
    },

    redemption: {
        configApi : "/pepocorn-topups/info/",
        fetchPepoCornsBalanceApi: "",
        validatePricePoint: "/pepocorn-topups/validate",
        isAppUpdateKeyPath: "data.app_upgrade",
        pepoCornsNameKey: "product_name",
        pepoCornsImageKey: "product_image",
        pepoCornInputStep : "step",
        pepoInWeiPerStep: "pepo_in_wei_per_step",
        pepoBeneficiaryAddress: "pepo_beneficiary_address"
    },

    common: {
        resultType : "data.result_type"
    }
}

