import * as types from './constants';

export const showModalCover = (message = 'Processing...', footerText = '', alertData = null) => ({
  type: types.SHOW_MODAL_COVER,
  payload: {
    modal_cover: {
      message,
      footerText,
      show: true,
      alertData: alertData
    }
  }
});

export const hideModalCover = (message = '', footerText = '') => ({
  type: types.HIDE_MODAL_COVER,
  payload: {
    modal_cover: {
      message,
      footerText,
      show: false
    }
  }
});

export const showLoginPopover = () => ({
  type: types.SHOW_LOGIN_POPOVER,
  payload: {
    login_popover: {
      show: true,
      isTwitterConnecting: false
    }
  }
});

export const hideLoginPopover = () => {
  return {
    type: types.HIDE_LOGIN_POPOVER,
    payload: {
      login_popover: {
        show: false,
        isTwitterConnecting: false
      }
    }
  };
};

export const showConnectingLoginPopover = () => {
  return {
    type: types.SHOW_CONNECTING_LOGIN_POPOVER,
    payload: {
      login_popover: {
        show: true,
        isTwitterConnecting: true
      }
    }
  };
};

export const updateCurrentUser = (current_user) => ({
  type: types.UPDATE_CURRENT_USER,
  payload: {
    current_user
  }
});

export const upsertUserEntities = (data) => ({ type: types.UPSERT_USER_ENTITIES, payload: { user_entities: data } });

export const upsertUserProfileEntities = (data) => ({
  type: types.UPSERT_USER_PROFILE_ENTITIES,
  payload: { user_profile_entities: data }
});

export const upsertLinkEntities = (data) => ({ type: types.UPSERT_LINK_ENTITIES, payload: { link_entities: data } });

export const upsertVideoEntities = (data) => ({ type: types.UPSERT_VIDEO_ENTITIES, payload: { video_entities: data } });

export const upsertVideoStatEntities = (data) => ({
  type: types.UPSERT_VIDEO_STAT_ENTITIES,
  payload: { video_stat_entities: data }
});

export const upsertReplyDetailEntities = (data) => ({
  type: types.UPSERT_REPLY_DETAIL_ENTITIES,
  payload: { reply_detail_entities: data }
});

export const upsertCurrentUserReplyDetailRelationEntities = (data) => ({
  type: types.UPSERT_CURRENT_USER_REPLY_DETAIL_RELATION_ENTITIES,
  payload: { current_user_reply_detail_relation_entities: data }
});

export const upsertImageEntities = (data) => ({ type: types.UPSERT_IMAGE_ENTITIES, payload: { image_entities: data } });

export const updateBalance = (balance = '0') => ({
  type: types.UPDATE_BALANCE,
  payload: {
    balance: balance
  }
});

export const updateIsPurchase = (isPurchase = false) => ({
  type: types.UPDATE_IS_PURCHASE,
  payload: {
    isPurchase: isPurchase
  }
});

export const updateExecuteTransactionStatus = (status = false) => ({
  type: types.UPDATE_EXECUTE_TRANSACTION_STATUS,
  payload: {
    executeTransactionDisabledStatus: status
  }
});

export const upsertRecordedVideo = (data) => ({ type: types.UPSERT_RECORDED_VIDEO, payload: { recorded_video: data } });

export const clearRecordedVideo = () => ({ type: types.CLEAR_RECORDED_VIDEO });

export const upsertProfilePicture = (data) => ({
  type: types.UPSERT_PROFILE_PICTURE,
  payload: { profile_picture: data }
});

export const clearProfilePicture = () => ({ type: types.CLEAR_PROFILE_PICTURE });

export const videoInProcessing = (videoInProcessing) => ({
  type: types.VIDEO_IN_PROCESSING,
  payload: { video_in_processing: videoInProcessing }
});

export const logoutUser = () => ({ type: types.LOGOUT_USER });

export const genericEvent = (eventName, payload) => ({
  type: types.GENERIC_EVENT,
  eventName: eventName,
  payload
});

export const upsertNotificationUnread = (data) => ({
  type: types.UPSERT_NOTIFICATION_UNREAD,
  payload: { notification_unread: data }
});

export const clearPushNotification = () => ({ type: types.CLEAR_PUSH_NOTIFICATION });

export const upsertInviteCode = (data) => ({
  type: types.UPSERT_INVITE_CODE,
  payload: {
    invite_code: data
  }
});

export const upsertUnseenReplies = (data) => ({
  type: types.UPSERT_UNSEEN_REPLIES,
  payload: {
    unseen_replies_entities: data
  }
});

export const upsertAllWhitelisted = (data) => ({
  type: types.UPSERT_ALL_WHITELISTED,
  payload: data
});


