import deepGet from 'lodash/get';

import store from '../store';
import DataContract from "../constants/DataContract";
import ReduxGetters from "../services/ReduxGetters";
import { upsertCurrentUserVideoRelationEntities } from '../reducers';
import Utilities from '../services/Utilities';

async function openRepliesList( parentUserId, parentVideoId, fetchServicesClonedInstance, currentIndex, navigation){
    navigation.push('FullScreenReplyCollection',{
      "fetchServices": fetchServicesClonedInstance,
      "currentIndex": currentIndex,
      "baseUrl": DataContract.replies.getReplyListApi(parentVideoId),
      'userId': parentUserId,
      'videoId': parentVideoId
    });
}

function updateEntitySeen (item) {
    const entityId = ReduxGetters.getReplyEntityId(deepGet(item,'payload.reply_detail_id'));
    let currentUserVideoRelationEntity = ReduxGetters.getCurrentUserVideoRelationEntity( entityId );
    if(currentUserVideoRelationEntity){
      currentUserVideoRelationEntity['has_seen'] = true;
      store.dispatch(upsertCurrentUserVideoRelationEntities(Utilities._getEntityFromObj(currentUserVideoRelationEntity)));
    } 
  }

export default { openRepliesList, updateEntitySeen }