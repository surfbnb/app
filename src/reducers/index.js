import { createActions, handleActions } from 'redux-actions';
import { UPSERT_POSTS, UPSERT_USERS, UPDATE_DEVICE_REGISTERED } from '../actions/constants';

export const { upsertPosts, upsertUsers, updateDeviceRegistered } = createActions(
  UPSERT_POSTS,
  UPSERT_USERS,
  UPDATE_DEVICE_REGISTERED
);

export const reducer = handleActions(
  {
    [upsertPosts]: (state, action) => {
      console.log('inside ');
      return { ...state, feed: action.payload.feed };
    },
    [upsertUsers]: (state, action) => {
      return { ...state, users: action.payload.users };
    },
    [updateDeviceRegistered]: (state, action) => {
      return { ...state, users: action.payload.isDeviceRegistered };
    }
  },
  { feed: {}, users: {}, isDeviceRegistered: false }
);
