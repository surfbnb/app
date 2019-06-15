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

export const logoutUser = () => ({ type: types.LOGOUT_USER });

export const genericEvent = (eventName, payload) => ({
  type: types.GENERIC_EVENT,
  eventName: eventName,
  payload
});
