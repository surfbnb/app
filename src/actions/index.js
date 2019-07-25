import * as types from './constants';

export const showModal = (message = '') => ({
  type: types.SHOW_MODAL,
  payload: {
    modal: {
      message,
      show: true
    }
  }
});

export const hideModal = (message = '') => ({
  type: types.HIDE_MODAL,
  payload: {
    modal: {
      message,
      show: false
    }
  }
});

export const showModalCover = (
  message = 'Processing...',
  footerText = 'This may take a while,\n we are surfing on Blockchain'
) => ({
  type: types.SHOW_MODAL_COVER,
  payload: {
    modal_cover: {
      message,
      footerText,
      show: true
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
      show: true
    }
  }
});

export const hideLoginPopover = () => ({
  type: types.HIDE_LOGIN_POPOVER,
  payload: {
    login_popover: {
      show: false
    }
  }
});

export const showToast = (message = '') => ({
  type: types.SHOW_TOAST,
  payload: {
    toast: {
      message,
      show: true
    }
  }
});

export const hideToast = (message = '') => ({
  type: types.HIDE_TOAST,
  payload: {
    toast: {
      message,
      show: false
    }
  }
});

export const updateCurrentUser = (current_user) => ({
  type: types.UPDATE_CURRENT_USER,
  payload: {
    current_user
  }
});

export const upsertUserEntities = (data) => ({ type: types.UPSERT_USER_ENTITIES, payload: { user_entities: data } });

export const upsertFeedEntities = (data) => ({ type: types.UPSERT_FEED_ENTITIES, payload: { feed_entities: data } });

export const upsertTransactionEntities = (data) => ({
  type: types.UPSERT_TRANSACTION_ENTITIES,
  payload: { transaction_entities: data }
});

export const upsertGiffyEntities = (data) => ({ type: types.UPSERT_GIFFY_ENTITIES, payload: { giffy_entities: data } });

export const upsertTagEntities = (data) => ({ type: types.UPSERT_TAG_ENTITIES, payload: { tag_entities: data } });

export const upsertUserProfileEntities = (data) =>({ type : types.UPSERT_USER_PROFILE_ENTITIES ,  payload:{ user_profile_entities : data }});

export const upsertUserStatEntities = (data) => ({type: types.UPSERT_USER_STAT_ENTITIES  , payload: {user_stat_entities: data} });

export const upsertLinkEntities = (data) => ({type : types.UPSERT_LINK_ENTITIES ,  payload: {link_entities : data}});

export const upsertVideoEntities = (data) => ({type : types.UPSERT_VIDEO_ENTITIES ,  payload: {video_entities : data}});

export const upsertVideoStatEntities = (data) => ({type : types.UPSERT_VIDEO_STAT_ENTITIES ,  payload: {video_stat_entities : data}});

export const upsertHomeFeedEntities = (data) => ({type : types.UPSERT_HOME_FEED_ENTITIES ,  payload: {home_feed_entities : data}});

export const upsertImageEntities = (data) => ({type : types.UPSERT_IMAGE_ENTITIES ,  payload: {image_entities : data}});

export const upsertVideoContributionEntities = (data) => ({type : types.UPSERT_VIDEO_CONTRIBUTION_ENTITIES ,  payload: {video_contribution_entities : data}});

export const upsertUserContributionEntities = (data) => ({type : types.UPSERT_USER_CONTRIBUTION_ENTITIES ,  payload: {user_contribution_entities : data}});

export const updatePricePoints = (data) => ({type : types.UPDATE_PRICE_POINTS ,  payload: {price_points : data}});

export const updateToken = (data) => ({type : types.UPDATE_TOKEN ,  payload: {token : data}});

export const updateBalance = (balance = "0" )=>({
  type: types.UPDATE_BALANCE,
  payload: {
    balance: balance
  }
});

export const updateExecuteTransactionStatus = ( status = false )=>({
  type: types.UPDATE_EXECUTE_TRANSACTION_STATUS,
  payload: {
    executeTransactionDisabledStatus: status
  }
});

export const upsertRecordedVideo = (data) => ({ type: types.UPSERT_RECORDED_VIDEO, payload: { recorded_video: data } });

export const clearRecordedVideo = () => ({ type: types.CLEAR_RECORDED_VIDEO });

export const upsertProfilePicture = (data) => ({ type: types.UPSERT_PROFILE_PICTURE, payload: { profile_picture: data } });

export const clearProfilePicture = () => ({ type: types.CLEAR_PROFILE_PICTURE});



export const videoInProcessing = (videoInProcessing) => ({ type: types.VIDEO_IN_PROCESSING, payload: {video_in_processing: videoInProcessing} });


export const logoutUser = () => ({ type: types.LOGOUT_USER });

export const genericEvent = (eventName, payload) => ({
  type: types.GENERIC_EVENT,
  eventName: eventName,
  payload
});
