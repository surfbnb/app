export default {

    actionTypes: {
        pay: "pay"
    },

    knownEntityTypes : {
        reply:"reply",
        video:"video",
        tag: "tag",
        channel: "channel",
        user: "user"
    },

    feed: {
        homeApi: "/feeds",
        getSingleFeedApi : (id) => {
            return `/feeds/${id}`
        }
    },

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
        validateReply: "/replies/validate-upload",
        getReplyListApi : (id) => {
            return `/videos/${id}/replies`
        },
        getDeleteVideoReplyApi : (id) => {
            return `/replies/${id}/delete`;
        },
        validatePost: "/videos/validate-upload",
        getSingleVideoReplyApi : (id) => {
            return `/replies/${id}`;
        },
        videoReplyKind: {
            video: "VIDEO"
        },
        replyDetailIdKey: 'reply_detail_id',
        parentVideoIdKey: 'parent_id',
        creatorUserIdKey: 'creator_user_id',
        replyDetailsKey: 'reply_details'
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
        }, 
        getVideoDetailsApi : (id) => {
            return `/videos/${id}`;
        },
        videoKind: {
            reply : "VIDEO_REPLY",
            video:"FAN_UPDATE"
        },
        kindKey: "kind",
        creatorUserIdKey: 'creator_user_id',
        videoDetailsKey: 'video_details'
    },

    share: {
        getVideoShareApi: ( id ) => {
            return `/videos/${id}/share`;
        },
        getVideoReplyShareApi: ( id ) => {
            return `/replies/${id}/share`;
        },
        getChannelShareApi: ( id ) => {
            return `/channels/${id}/share`
        },
      getProfileShareApi: ( id ) => {
            return `/users/${id}/share`
          }
    },

    channels: {
        getVideoListApi : (id) => {
            return `/channels/${id}/videos`;
        },
        getVideoListParams : (id=0)=> {
            return id ? {filter_by_tag_id: id} : {};
        },
        getChannelDetails : (id)=> {
            return `/channels/${id}`;
        },
        getChannelsMemberApi: (id) => {
            return `/channels/${id}/users`;
        },
        getMuteApi : (id) => {
            return `/channels/${id}/turn-off-notifications`;
        },
        getUnmuteApi : (id) => {
            return `/channels/${id}/turn-on-notifications`;
        },
        getLeaveChannelApi : (id) => {
            return `/channels/${id}/leave`
        },
        getJoinChannelApi : (id) => {
            return `/channels/${id}/join`
        },
        getReportChannelApi : () => {
            return `/report`
        }
    },
    
    actionSheet: {
        video : {
            reportApi: '/report',
            getMuteUnMuteApi : (id, canMute) => {
                if(canMute){
                    return  `/users/${id}/mute` ;
                }else{
                    return  `/users/${id}/unmute`;
                }
            }
        }
    }

}

