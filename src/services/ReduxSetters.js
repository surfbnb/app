import Store from '../store';
import * as Actions from '../actions';

const knownEntitiesDispatcherMap = {
  ost_transaction: 'upsertTransactionEntities',
  gifs: 'upsertGiffyEntities',
  tags: 'upsertTagEntities',
  user_profiles: 'upsertUserProfileEntities',
  user_profile: 'upsertUserProfileEntities',
  user_stats: 'upsertUserStatEntities',
  links: 'upsertLinkEntities',
  videos: 'upsertVideoEntities',
  video_details: 'upsertVideoStatEntities',
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
  user_notifications: 'upsertUserNotifications',
  feeds: 'upsertHomeFeedEntities',
  feed: 'upsertHomeFeedEntities'
};

const dispatchEntities = (data) => {
  if(!data) return;
  for (let entity in data){
    data.hasOwnProperty(entity) && Actions[knownEntitiesDispatcherMap[entity]] && Store.dispatch(Actions[knownEntitiesDispatcherMap[entity]](getEntities(data[entity])));
  }
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
    if(isNaN(parseInt(identifier))){
      entities[identifier] = resultObj[identifier];
    } else {
      entities[`${key}_${identifier}`] = resultObj[identifier];
    }
  }
  return entities;
};

export default dispatchEntities;
