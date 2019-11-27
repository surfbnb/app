import { createActions, handleActions } from 'redux-actions';
import assignIn from 'lodash/assignIn';
import merge from 'lodash/merge';
import * as types from '../actions/constants';

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
  upsertActivitiesEntities,
  upsertTransactionEntities,
  upsertGiffyEntities,
  upsertTagEntities,
  upsertLinkEntities,
  upsertUserProfileEntities,
  upsertUserAllowedActionEntities,
  upsertUserStatEntities,
  upsertVideoEntities,
  upsertVideoStatEntities,
  upsertReplyDetailEntities,
  upsertCurrentUserVideoRelationEntities,
  upsertCurrentUserReplyDetailRelationEntities,
  upsertImageEntities,
  upsertHomeFeedEntities,
  updateBalance,
  updateIsPurchase,
  updatePricePoints,
  updateToken,
  updatePepocorn,
  updateExecuteTransactionStatus,
  upsertVideoContributionEntities,
  upsertReplyContributionEntities,
  upsertUserContributionEntities,
  upsertRecordedVideo,
  clearRecordedVideo,
  videoInProcessing,
  upsertProfilePicture,
  clearProfilePicture,
  upsertUserVideoEntities,
  upsertUserContributionToStats,
  upsertUserContributionByStats,
  upsertUserNotifications,
  upsertVideoDescriptionEntities,
  upsertNotificationUnread,
  upsertPushNotification,
  clearPushNotification,
  upsertInviteCode,
  upsertTwitterEntities,
  upsertTagVideoEntities
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
  user_allowed_action_entities: {}
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
  executeTransactionDisabledStatus: false,
  recorded_video: {},
  profile_picture: {},
  push_notification: {},
  balance: null,
  notification_unread: {},
  invite_code: null,
  twitter_entities : null,
  user_allowed_action_entities:{}
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
    [upsertActivitiesEntities]: (state, action) => ({
      ...state,
      activities_entities: assignIn({}, state.activities_entities, action.payload.activities_entities)
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
    [upsertUserAllowedActionEntities]: (state, action) => ({
      ...state,
      user_allowed_action_entities: assignIn({}, state.user_allowed_action_entities, action.payload.user_allowed_action_entities)
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
    [upsertReplyDetailEntities]: (state, action) => ({
      ...state,
      reply_detail_entities: assignIn({}, state.reply_detail_entities, action.payload.reply_detail_entities)
    }),
    [upsertCurrentUserVideoRelationEntities]: (state, action) => ({
      ...state,
      current_user_video_relation_entities: assignIn({}, state.current_user_video_relation_entities, action.payload.current_user_video_relation_entities)
    }),
    [upsertCurrentUserReplyDetailRelationEntities]: (state, action) => ({
      ...state,
      current_user_reply_detail_relation_entities: assignIn({}, state.current_user_reply_detail_relation_entities, action.payload.current_user_reply_detail_relation_entities)
    }),
    [upsertVideoDescriptionEntities]: (state, action) => ({
      ...state,
      video_description_entities: assignIn(
        {},
        state.video_description_entities,
        action.payload.video_description_entities
      )
    }),
    [upsertImageEntities]: (state, action) => ({
      ...state,
      image_entities: assignIn({}, state.image_entities, action.payload.image_entities)
    }),
    [upsertHomeFeedEntities]: (state, action) => ({
      ...state,
      home_feed_entities: assignIn({}, state.home_feed_entities, action.payload.home_feed_entities)
    }),
    [upsertUserVideoEntities]: (state, action) => ({
      ...state,
      user_video_entities: assignIn({}, state.user_video_entities, action.payload.user_video_entities)
    }),
    [upsertTagVideoEntities]: (state, action) => ({
      ...state,
      tag_video_entities: assignIn({}, state.tag_video_entities, action.payload.tag_video_entities)
    }),
    [upsertVideoContributionEntities]: (state, action) => ({
      ...state,
      video_contribution_entities: assignIn(
        {},
        state.video_contribution_entities,
        action.payload.video_contribution_entities
      )
    }),
    [upsertReplyContributionEntities]: (state, action) => ({
      ...state,
      reply_contribution_entities: assignIn(
        {},
        state.reply_contribution_entities,
        action.payload.reply_contribution_entities
      )
    }),
    [upsertUserContributionEntities]: (state, action) => ({
      ...state,
      user_contribution_entities: assignIn(
        {},
        state.user_contribution_entities,
        action.payload.user_contribution_entities
      )
    }),
    [updateBalance]: (state, action) => ({
      ...state,
      balance: action.payload.balance
    }),
    [updateIsPurchase]: (state, action)=>({
      ...state,
      balance: action.payload.isPurchase
    }),
    [updatePricePoints]: (state, action) => {
      //Make sure price_points is not null;
      if (!action.payload.price_points) {
        return {...state};
      }

      // Make sure response has keys;
      if ( !Object.keys(action.payload.price_points).length ) {
        return {...state};
      }

      return {
        ...state,
        price_points: action.payload.price_points
      };
    },
    [updateToken]: (state, action) => ({
      ...state,
      token: action.payload.token
    }),
    [updatePepocorn]: (state, action) => ({
      ...state,
      pepocorn: action.payload.pepocorn
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
    [upsertUserContributionByStats]: (state, action) => ({
      ...state,
      user_contribution_by_stats: merge({}, state.user_contribution_by_stats, action.payload.user_contribution_by_stats)
    }),
    [upsertUserContributionToStats]: (state, action) => ({
      ...state,
      user_contribution_to_stats: merge({}, state.user_contribution_to_stats, action.payload.user_contribution_to_stats)
    }),
    [upsertUserNotifications]: (state, action) => ({
      ...state,
      user_notifications: assignIn({}, state.user_notifications, action.payload.user_notifications)
    }),
    [upsertPushNotification]: (state, action) => ({
      ...state,
      push_notification: assignIn({}, state.push_notification, action.payload.push_notification)
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
    [upsertTwitterEntities]: (state, action) => ({
      ...state,
      twitter_entities: assignIn({}, state.twitter_entities, action.payload.twitter_entities)
    })
  },
  defaultState
);
