import { createActions, handleActions } from 'redux-actions';
import { UPSERT_POSTS, UPSERT_USERS, SET_LOGGED_IN, SHOW_MODAL, HIDE_MODAL } from '../actions/constants';

export const { upsertPosts, upsertUsers, setLoggedIn, showModal, hideModal } = createActions(
  UPSERT_POSTS,
  UPSERT_USERS,
  SET_LOGGED_IN,
  SHOW_MODAL,
  HIDE_MODAL
);

export const reducer = handleActions(
  {
    [upsertPosts]: (state, action) => ({ ...state, feed: action.payload.feed }),
    [upsertUsers]: (state, action) => ({ ...state, users: action.payload.users }),
    [setLoggedIn]: (state, action) => ({ ...state, isLoggedIn: action.payload.isLoggedIn }),
    [showModal]: (state, action) => ({ ...state, modal: action.payload.modal }),
    [hideModal]: (state, action) => ({ ...state, modal: action.payload.modal })
  },
  {
    feed: [],
    users: [],
    isLoggedIn: false,
    modal: { message: '', show: false }
  }
);
