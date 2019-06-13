import * as types from './constants';

export const upsertPosts = (data) => ({ type: types.UPSERT_POSTS, payload: { feed: data } });

export const setLoggedIn = (isLoggedIn) => ({
  type: types.SET_LOGGED_IN,
  payload: { isLoggedIn: isLoggedIn }
});

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

export const upsertUserEntities = (data) => ({ type: types.UPSERT_USER_ENTITIES, payload: { user_entities: data } });

export const addUserList = (data) => ({ type: types.ADD_USER_LIST, payload: { user_list: data } });
