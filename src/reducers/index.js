import { createActions, handleActions } from 'redux-actions';
import { UPSERT_POSTS, UPSERT_USERS } from '../actions/constants';

export const { upsertPosts, upsertUsers } = createActions(UPSERT_POSTS, UPSERT_USERS);

export const reducer = handleActions(
  {
    [upsertPosts]: (state, action) => {
      console.log('inside ');
      return { ...state, feed: action.payload.feed };
    },
    [upsertUsers]: (state, action) => {
      return { ...state, users: action.payload.users };
    }
  },
  { feed: {}, users: {} }
);
