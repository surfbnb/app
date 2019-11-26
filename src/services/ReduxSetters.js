import Store from '../store';
import * as Actions from '../actions';

const knownEntitiesDispatcherMap = {
  ost_transaction: 'upsertTransactionEntities',
  gifs: 'upsertGiffyEntities',
  tags: 'upsertTagEntities',
  tag_search_results:'upsertTagEntities',
  user_search_results:'upsertUserEntities',
  user_profiles: 'upsertUserProfileEntities',
  user_stats: 'upsertUserStatEntities',
  links: 'upsertLinkEntities',
  video_descriptions: 'upsertVideoDescriptionEntities',
  videos: 'upsertVideoEntities',
  video_details: 'upsertVideoStatEntities',
  video_replies: 'upsertVideoReplyEntities',
  reply_details: 'upsertReplyDetailEntities',
  current_user_video_relations: 'upsertCurrentUserVideoRelationEntities',
  current_user_reply_detail_relations: 'upsertCurrentUserReplyDetailRelationEntities',
  images: 'upsertImageEntities',
  current_user_video_contributions: 'upsertVideoContributionEntities',
  current_user_user_contributions: 'upsertUserContributionEntities',
  price_points: 'updatePricePoints',
  token: 'updateToken',
  users: 'upsertUserEntities',
  contribution_to_users: 'upsertUserEntities',
  contribution_by_users: 'upsertUserEntities',
  user_contribution_to_stats: 'upsertUserContributionToStats',
  user_contribution_by_stats: 'upsertUserContributionByStats',
  contribution_suggestions: 'upsertUserEntities',
  public_activity: 'upsertActivitiesEntities',
  user_activity: 'upsertActivitiesEntities',
  user_videos: 'upsertUserVideoEntities',
  tag_videos: 'upsertTagVideoEntities',
  user_notifications: 'upsertUserNotifications',
  feeds: 'upsertHomeFeedEntities',
  notification_unread: 'notification_unread',
  feed: 'upsertHomeFeedEntities',
  upsert_push_notification: 'upsertPushNotification',
  twitter_users : 'upsertTwitterEntities',
  user_allowed_actions: 'upsertUserAllowedActionEntities',
  pepocorn_balance: 'updatePepocorn'
};

// This is a map of signular entity result_type w.r.t. result_type of result collect (Array/HashMap) of same type.
const knownSinglularEntityMap = {
  "user_profile": "user_profiles"
};

const dispatchEntities = (data) => {
  if (!data) return;
  for (let entity in data) { if (data.hasOwnProperty(entity)) {

    let reduxAction = knownEntitiesDispatcherMap[entity];
    let entitiesData = data[entity];


      if ( null == reduxAction ) {
        // Try know singular entity.
        let entityCollectionKey = knownSinglularEntityMap[entity];
        if ( entityCollectionKey ) {
          // Manipulate the data.
          entitiesData = [entitiesData];
          // Manipulate the redux action.
          reduxAction = knownEntitiesDispatcherMap[entityCollectionKey];
        }
      }

      if ( Actions[reduxAction] ) {
        Store.dispatch(Actions[reduxAction](getEntities(entitiesData)));
      }

  }}
};

const getEntities = (entities, key = 'id') => {
  if (entities instanceof Array) {
    return getEntitiesFromArray(entities, key);
  }
  return getEntitiesFromObj(entities, key);
};

const getEntitiesFromArray = (resultData, key = 'id') => {
  const entities = {};
  resultData.forEach((item) => {
    entities[`${key}_${item[key]}`] = item;
  });
  return entities;
};

const getEntitiesFromObj = (resultObj, key = 'id') => {
  const entities = {};
  for (let identifier in resultObj) {
    if (resultObj.hasOwnProperty(identifier)) {
      let key_identifier = isNaN(parseInt(identifier)) ? identifier : `${key}_${identifier}`;
      entities[key_identifier] = resultObj[identifier];
    }
  }
  return entities;
};

export default dispatchEntities;
