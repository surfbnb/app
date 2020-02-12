import { createActions, handleActions } from 'redux-actions';
import assignIn from 'lodash/assignIn';
import merge from 'lodash/merge';

import * as types from '../actions/constants';
import {upsertAllWhitelistedAction} from '../services/ReduxSetters';

export const {
  showModal,
  hideModal,
  showModalCover,
  hideModalCover,
  showLoginPopover,
  hideLoginPopover,
  showConnectingLoginPopover,
  showToast,
  hideToast,
  upsertUserEntities,
  updateCurrentUser,
  logoutUser,
  upsertLinkEntities,
  upsertUserProfileEntities,
  upsertVideoEntities,
  upsertVideoStatEntities,
  upsertReplyDetailEntities,
  upsertCurrentUserReplyDetailRelationEntities,
  upsertImageEntities,
  updateBalance,
  updateIsPurchase,
  updateExecuteTransactionStatus,
  upsertRecordedVideo,
  clearRecordedVideo,
  videoInProcessing,
  upsertProfilePicture,
  clearProfilePicture,
  upsertNotificationUnread,
  clearPushNotification,
  upsertInviteCode,
  upsertUnseenReplies,
  upsertAllWhitelisted
} = createActions(...Object.keys(types));

const defaultState = {
  modal: { message: '', show: false },
  modal_cover: { message: '', footerText: '', show: false, alertData: null },
  toast: { message: '', show: false },
  current_user: {},
  activities_entities: {},
  transaction_entities: {},
  giffy_entities: {},
  tag_entities: {},
  user_profile_entities: {},
  user_entities: {},
  user_stat_entities: {},
  link_entities: {},
  video_entities: {},
  video_stat_entities: {},
  reply_detail_entities: {},
  current_user_video_relation_entities: {},
  current_user_reply_detail_relation_entities: {},
  user_contribution_to_stats: {},
  user_contribution_by_stats: {},
  video_description_entities: {},
  image_entities: {},
  home_feed_entities: {},
  video_contribution_entities: {},
  user_contribution_entities: {},
  login_popover: { show: false },
  executeTransactionDisabledStatus: false,
  recorded_video: {},
  profile_picture: {},
  token: { decimals: 18 },
  push_notification: {},
  balance: null,
  isPurchase: false,
  notification_unread: {},
  invite_code: null,
  twitter_entities : {},
  user_allowed_action_entities: {},
  user_replies_entities:{}
};

const logoutDefault = {
  current_user: {},
  activities_entities: {},
  transaction_entities: {},
  giffy_entities: {},
  tag_entities: {},
  user_profile_entities: {},
  user_entities: {},
  user_stat_entities: {},
  link_entities: {},
  video_entities: {},
  video_stat_entities: {},
  reply_detail_entities: {},
  current_user_video_relation_entities: {},
  current_user_reply_detail_relation_entities: {},
  video_description_entities: {},
  image_entities: {},
  home_feed_entities: {},
  video_contribution_entities: {},
  user_contribution_entities: {},
  user_contribution_to_stats: {},
  user_contribution_by_stats: {},
  executeTransactionDisabledStatus: false,
  recorded_video: {},
  profile_picture: {},
  push_notification: {},
  balance: null,
  notification_unread: {},
  invite_code: null,
  twitter_entities : null,
  user_allowed_action_entities:{},
  unseen_replies_entities: {},
  user_replies_entities:{}
};

export const reducer = handleActions(
  {
    [showModal]: (state, action) => ({ ...state, modal: action.payload.modal }),
    [showModalCover]: (state, action) => ({ ...state, modal_cover: action.payload.modal_cover }),

    [showLoginPopover]: (state, action) => ({ ...state, login_popover: action.payload.login_popover }),
    [showConnectingLoginPopover]: (state, action) => ({ ...state, login_popover: action.payload.login_popover }),
    [hideLoginPopover]: (state, action) => ({ ...state, login_popover: action.payload.login_popover }),

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
    [upsertUserProfileEntities]: (state, action) => ({
      ...state,
      user_profile_entities: assignIn({}, state.user_profile_entities, action.payload.user_profile_entities)
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
    [upsertReplyDetailEntities]: (state, action) => ({
      ...state,
      reply_detail_entities: assignIn({}, state.reply_detail_entities, action.payload.reply_detail_entities)
    }),
    [upsertCurrentUserReplyDetailRelationEntities]: (state, action) => ({
      ...state,
      current_user_reply_detail_relation_entities: assignIn({}, state.current_user_reply_detail_relation_entities, action.payload.current_user_reply_detail_relation_entities)
    }),
    [upsertImageEntities]: (state, action) => ({
      ...state,
      image_entities: assignIn({}, state.image_entities, action.payload.image_entities)
    }),
    [updateBalance]: (state, action) => ({
      ...state,
      balance: action.payload.balance
    }), 
    [updateIsPurchase]: (state, action)=>({
      ...state,
      balance: action.payload.isPurchase
    }),
    [updateExecuteTransactionStatus]: (state, action) => ({
      ...state,
      executeTransactionDisabledStatus: action.payload.executeTransactionDisabledStatus
    }),
    [upsertRecordedVideo]: (state, action) => ({
      ...state,
      recorded_video: assignIn({}, state.recorded_video, action.payload.recorded_video)
    }),
    [clearRecordedVideo]: (state, action) => ({
      ...state,
      recorded_video: assignIn(defaultState.recorded_video)
    }),

    [upsertProfilePicture]: (state, action) => ({
      ...state,
      profile_picture: assignIn({}, state.profile_picture, action.payload.profile_picture)
    }),

    [clearProfilePicture]: (state, action) => ({
      ...state,
      profile_picture: assignIn(defaultState.profile_picture)
    }),

    [videoInProcessing]: (state, action) => ({
      ...state,
      video_in_processing: action.payload.video_in_processing
    }),
    [logoutUser]: (state, action) => ({
      ...state,
      ...logoutDefault
    }),
    [clearPushNotification]: (state, action) => ({
      ...state,
      push_notification: assignIn(defaultState.push_notification)
    }),
    [upsertNotificationUnread]: (state, action) => ({
      ...state,
      notification_unread: assignIn({}, state.notification_unread, action.payload.notification_unread)
    }),
    [upsertInviteCode]: (state, action) => ({
      ...state,
      invite_code: action.payload.invite_code
    }),
    [upsertUnseenReplies]: (state, action) => ({
      ...state,
      unseen_replies_entities: assignIn({}, state.unseen_replies_entities, action.payload.unseen_replies_entities)
    }),
    [upsertAllWhitelisted]: upsertAllWhitelistedAction
  },
  defaultState
);
