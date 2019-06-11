import { createActions, handleActions } from 'redux-actions';
import { UPSERT_POSTS, UPSERT_USERS, SET_LOGGED_IN } from '../actions/constants';

export const { upsertPosts, upsertUsers, setLoggedIn } = createActions(UPSERT_POSTS, UPSERT_USERS, SET_LOGGED_IN);

export const reducer = handleActions(
  {
    [upsertPosts]: (state, action) => {
      return { ...state, feed: action.payload.feed };
    },
    [upsertUsers]: (state, action) => {
      return { ...state, users: action.payload.users };
    },
    [setLoggedIn]: (state, action) => {
      return { ...state, isLoggedIn: action.payload.isLoggedIn };
    }
  },
  { feed: [], users: [], isLoggedIn: false }
);
