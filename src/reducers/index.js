import { createActions, handleActions } from 'redux-actions';
import AssignIn from 'lodash/assignIn';
import * as types from '../actions/constants';

export const {
  upsertPosts,
  setLoggedIn,
  showModal,
  hideModal,
  upsertUserEntities,
  addUserList,
  logoutUser
} = createActions(...Object.keys(types));

const defaultState = {
  feed: [],
  users: [],
  isLoggedIn: false,
  modal: { message: '', show: false },
  user_entities: {},
  user_list: []
};

export const reducer = handleActions(
  {
    [upsertPosts]: (state, action) => ({ ...state, feed: action.payload.feed }),
    [setLoggedIn]: (state, action) => ({ ...state, isLoggedIn: action.payload.isLoggedIn }),
    [showModal]: (state, action) => ({ ...state, modal: action.payload.modal }),
    [hideModal]: (state, action) => ({ ...state, modal: action.payload.modal }),
    [upsertUserEntities]: (state, action) => ({
      ...state,
      user_entities: AssignIn(state.user_entities, action.payload.user_entities)
    }),
    [addUserList]: (state, action) => ({
      ...state,
      user_list: [...state.user_list, ...action.payload.user_list]
    }),
    [logoutUser]: (state, action) => ({ ...defaultState, user_entities: {} })
  },
  defaultState
);
