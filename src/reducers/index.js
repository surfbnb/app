import { createActions, handleActions } from 'redux-actions';
import assignIn from 'lodash/assignIn';
import * as types from '../actions/constants';

export const {
  showModal,
  hideModal,
  showModalCover,
  hideModalCover,
  showLoginPopover,
  hideLoginPopover,
  showToast,
  hideToast,
  upsertUserEntities,
  updateCurrentUser,
  logoutUser,
  upsertFeedEntities,
  upsertTransactionEntities,
  upsertGiffyEntities,
  upsertTagEntities,
  upsertLinkEntities,
  upsertUserProfileEntities,
  upsertUserStatEntities,
  upsertVideoEntities,
  upsertVideoStatEntities,
  upsertImageEntities,
  upsertHomeFeedEntities,
  updateBalance,
  updatePricePoints,
  updateExecuteTransactionStatus,
  upsertVideoContributionEntities,
  upsertUserContributionEntities,
} = createActions(...Object.keys(types));

const defaultState = {
  modal: { message: '', show: false },
  modal_cover: { message: '', footerText: '', show: false },
  toast: { message: '', show: false },
  current_user: {},
  user_entities: {},
  feed_entities: {},
  transaction_entities: {},
  giffy_entities: {},
  tag_entities:{},
  user_profile_entities: {},
  user_entities: {},
  user_stat_entities: {},
  link_entities: {},
  video_entities: {},
  video_stat_entities: {},
  image_entities: {},
  home_feed_entities: {},
  video_contribution_entities: {},
  user_contribution_entities: {},
  login_popover: { show: false },
  executeTransactionDisabledStatus: false,
  balance: "0"
};

const loggoutState = {
  current_user: {}
};

export const reducer = handleActions(
  {
    [showModal]: (state, action) => ({ ...state, modal: action.payload.modal }),
    [showModalCover]: (state, action) => ({ ...state, modal_cover: action.payload.modal_cover }),
    [showLoginPopover]: (state, action) => ({ ...state, login_popover: action.payload.login_popover }),
    [hideModal]: (state, action) => ({ ...state, modal: action.payload.modal }),
    [hideModalCover]: (state, action) => ({ ...state, modal_cover: action.payload.modal_cover }),
    [hideLoginPopover]: (state, action) => ({ ...state, login_popover: action.payload.login_popover }),
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
    [upsertTagEntities]: (state, action) => ({
      ...state,
      tag_entities: assignIn({}, state.tag_entities, action.payload.tag_entities)
    }),
    [upsertUserProfileEntities]: (state, action) => ({
      ...state,
      user_profile_entities: assignIn({}, state.user_profile_entities, action.payload.user_profile_entities)
    }),
    [upsertUserStatEntities]: (state, action) => ({
      ...state,
      user_stat_entities: assignIn({}, state.user_stat_entities, action.payload.user_stat_entities)
    }),
    [upsertLinkEntities]: (state, action) => ({
      ...state,
      link_entities: assignIn({}, state.link_entities, action.payload.link_entities)
    }),
    [upsertVideoEntities]: (state, action) => ({
      ...state,
      video_entities: assignIn({}, state.video_entities, action.payload.video_entities)
    }),
    [upsertVideoStatEntities]: (state, action) => ({
      ...state,
      video_stat_entities: assignIn({}, state.video_stat_entities, action.payload.video_stat_entities)
    }),
    [upsertImageEntities]: (state, action) => ({
      ...state,
      image_entities: assignIn({}, state.image_entities, action.payload.image_entities)
    }),
    [upsertHomeFeedEntities]: (state, action) => ({
      ...state,
      home_feed_entities: assignIn({}, state.home_feed_entities, action.payload.home_feed_entities)
    }),
    [upsertVideoContributionEntities]: (state, action) => ({
      ...state,
      video_contribution_entities: assignIn({}, state.video_contribution_entities, action.payload.video_contribution_entities)
    }),
    [upsertUserContributionEntities]: (state, action) => ({
      ...state,
      user_contribution_entities: assignIn({}, state.user_contribution_entities, action.payload.user_contribution_entities)
    }),
    [updateBalance]: (state, action) =>({
      ...state,
      balance: action.payload.balance
    }),
    [updatePricePoints]: (state, action) =>({
      ...state,
      price_points: action.payload.price_points
    }),
    [updateExecuteTransactionStatus]: (state, action) =>({
      ...state,
      executeTransactionDisabledStatus: action.payload.executeTransactionDisabledStatus
    }),
    [logoutUser]: (state, action) => ({ 
      ...state,
      current_user: {},
      executeTransactionDisabledStatus: true,
      balance: "0"
    })
  },
  defaultState
);
