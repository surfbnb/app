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

export const addUserList = (data) => ({ type: types.ADD_USER_LIST, payload: { user_list: data } });

export const upsertFeedEntities = (data) => ({ type: types.UPSERT_FEED_ENTITIES, payload: { feed_entities: data } });

export const addPublicFeedList = (data) => ({ type: types.ADD_PUBLIC_FEED_LIST, payload: { public_feed_list: data } });

export const addUserFeedList = (data, user_id) => ({ type: types.ADD_USER_FEED_LIST, payload: { user_feed_list: data, user_id } });

export const upsertTransactionEntities = (data) => ({ type: types.UPSERT_TRANSACTION_ENTITIES, payload: { transaction_entities: data } });

export const upsertGiffyEntities = (data) => ({ type: types.UPSERT_GIFFY_ENTITIES, payload: { giffy_entities: data } });

export const logoutUser = () => ({ type: types.LOGOUT_USER });

export const genericEvent = (eventName, payload) => ({
  type: types.GENERIC_EVENT,
  eventName: eventName,
  payload
});
