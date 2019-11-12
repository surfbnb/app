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
        fetchPepoCornsBalanceApi: "/pepocorn-topups/balance",
        openRedemptionWebViewApi: "/redemptions/webview-url",
        validatePricePoint: "/pepocorn-topups/validate",
        appUpdateKeyPath: "data.app_upgrade",
        pepoCornsNameKey: "product_name",
        pepoCornsImageKey: "product_image",
        pepoCornInputStep : "step",
        pepoInWeiPerStep: "pepo_in_wei_per_step",
        pepoBeneficiaryAddress: "pepo_beneficiary_address",
        productIdKey : "product_id"
    },

    support: {
        infoApi: "/support/info"
    },

    replies: {
      validateReply: "replies/validate-upload", 
      getReplyListApi : (id) => {
        return `/videos/${id}/replies`
      },
      getDeleteVideoReplyApi : (id) => {
        return `/replies/${id}/delete`;
    }
    },

    common: {
        resultType : "data.result_type"
    },

    mentions: {
        userMentions: "/search/users-mention"
    },

    tags: {
       userTags: "/tags"
    },

    videos: {
        getDeleteVideoApi : (id) => {
            return `/videos/${id}/delete`;
        }
    }
}

