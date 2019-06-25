import { createActions, handleActions } from 'redux-actions';
import assignIn from 'lodash/assignIn';
import * as types from '../actions/constants';

export const {
  showModal,
  hideModal,
  showModalCover,
  hideModalCover,
  showToast,
  hideToast,
  upsertUserEntities,
  updateCurrentUser,
  logoutUser,
  upsertFeedEntities,
  upsertTransactionEntities,
  upsertGiffyEntities
} = createActions(...Object.keys(types));

const defaultState = {
  modal: { message: '', show: false },
  modal_cover: { message: '', footerText: '', show: false },
  toast: { message: '', show: false },
  current_user: {},
  user_entities: {},
  feed_entities: {},
  transaction_entities: {},
  giffy_entities: {}
};

export const reducer = handleActions(
  {
    [showModal]: (state, action) => ({ ...state, modal: action.payload.modal }),
    [showModalCover]: (state, action) => ({ ...state, modal_cover: action.payload.modal_cover }),
    [hideModal]: (state, action) => ({ ...state, modal: action.payload.modal }),
    [hideModalCover]: (state, action) => ({ ...state, modal_cover: action.payload.modal_cover }),
    [showToast]: (state, action) => ({ ...state, toast: action.payload.toast }),
    [hideToast]: (state, action) => ({ ...state, toast: action.payload.toast }),
    [upsertUserEntities]: (state, action) => ({
      ...state,
      user_entities: assignIn({}, state.user_entities, action.payload.user_entities)
    }),
    [updateCurrentUser]: (state, action) => ({
      ...state,
      current_user: assignIn({}, state.current_user, action.payload.current_user)
    }),
    [upsertFeedEntities]: (state, action) => ({
      ...state,
      feed_entities: assignIn({}, state.feed_entities, action.payload.feed_entities)
    }),
    [upsertTransactionEntities]: (state, action) => ({
      ...state,
      transaction_entities: assignIn({}, state.transaction_entities, action.payload.transaction_entities)
    }),
    [upsertGiffyEntities]: (state, action) => ({
      ...state,
      giffy_entities: assignIn({}, state.giffy_entities, action.payload.giffy_entities)
    }),
    [logoutUser]: (state, action) => ({ ...defaultState })
  },
  defaultState
);
