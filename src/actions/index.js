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

export const logoutUser = () => ({ type: types.LOGOUT_USER });

export const genericEvent = (eventName, payload) => ({
  type: types.GENERIC_EVENT,
  eventName: eventName,
  payload
});
