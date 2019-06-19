import { createActions, handleActions } from 'redux-actions';
import assignIn from 'lodash/assignIn';
import * as types from '../actions/constants';
import deepGet from 'lodash/get';

export const {
  showModal,
  hideModal,
  showToast,
  hideToast,
  upsertUserEntities,
  addUserList,
  updateCurrentUser,
  logoutUser,
  upsertFeedEntities,
  addPublicFeedList,
  addUserFeedList,
  upsertTransactionEntities,
  upsertGiffyEntities
} = createActions(...Object.keys(types));

const defaultState = {
  modal: { message: '', show: false },
  toast: { message: '', show: false },
  current_user: {},
  user_entities: {},
  user_list: [],
  feed_entities: {},
  public_feed_list: [],
  user_feed_list: {},
  transaction_entities: {},
  giffy_entities: {}
};

export const reducer = handleActions(
  {
    [showModal]: (state, action) => ({ ...state, modal: action.payload.modal }),
    [hideModal]: (state, action) => ({ ...state, modal: action.payload.modal }),
    [showToast]: (state, action) => ({ ...state, toast: action.payload.toast }),
    [hideToast]: (state, action) => ({ ...state, toast: action.payload.toast }),
    [upsertUserEntities]: (state, action) => ({
      ...state,
      user_entities: assignIn({}, state.user_entities, action.payload.user_entities)
    }),
    [addUserList]: (state, action) => ({
      ...state,
      user_list: [...state.user_list, ...action.payload.user_list]
    }),
    [updateCurrentUser]: (state, action) => ({
      ...state,
      current_user: assignIn({}, state.current_user, action.payload.current_user)
    }),
    [upsertFeedEntities]: (state, action) => ({
      ...state,
      feed_entities: assignIn({}, state.feed_entities, action.payload.feed_entities)
    }),
    [addPublicFeedList]: (state, action) => ({
      ...state,
      public_feed_list: [...state.public_feed_list, ...action.payload.public_feed_list]
    }),
    [upsertTransactionEntities]: (state, action) => ({
      ...state,
      transaction_entities: assignIn({}, state.transaction_entities, action.payload.transaction_entities)
    }),
    [upsertGiffyEntities]: (state, action) => ({
      ...state,
      giffy_entities: assignIn({}, state.giffy_entities, action.payload.giffy_entities)
    }),
    [addUserFeedList]: (state, action) => {
      let stateUserfeedList = state.user_feed_list,
        userId = action.payload.user_id,
        exisitingUserFeedList = deepGet(stateUserfeedList, userId) || [];
      (newUserFeedList = action.payload.user_feed_list),
        (userFeedList = [...exisitingUserFeedList, ...newUserFeedList]),
        (finalUserList = {});
      finalUserList[userId] = userFeedList;
      return {
        ...state,
        user_feed_list: assignIn({}, stateUserfeedList, finalUserList)
      };
    },
    [logoutUser]: (state, action) => ({ ...defaultState })
  },
  defaultState
);
