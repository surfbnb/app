import deepGet from 'lodash/get';

import store from '../store';
import DataContract from "../constants/DataContract";
import ReduxGetters from "../services/ReduxGetters";
import { upsertReplyDetailEntities } from '../reducers';
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
    const replyDetailId = deepGet(item,'payload.reply_detail_id');
    let replyEntity = ReduxGetters.getReplyEntity( replyDetailId );
    replyEntity['seen'] = true;
    store.dispatch(upsertReplyDetailEntities(Utilities._getEntityFromObj(replyEntity)));
  }

export default { openRepliesList, updateEntitySeen }