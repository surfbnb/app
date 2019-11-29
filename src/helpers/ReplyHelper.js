import deepGet from 'lodash/get';

import store from '../store';
import ReduxGetters from "../services/ReduxGetters";
import { upsertCurrentUserReplyDetailRelationEntities } from '../reducers';
import Utilities from '../services/Utilities';
import DataContract from '../constants/DataContract';


function updateEntitySeen (item) {
    const replyDetailId = deepGet(item,`payload.${DataContract.replies.replyDetailIdKey}`);
    let currentUserReplyDetailRelationEntity = ReduxGetters.getReplyDetailRelationEntity( replyDetailId );
    if(currentUserReplyDetailRelationEntity){
      currentUserReplyDetailRelationEntity['has_seen'] = true;
      store.dispatch(upsertCurrentUserReplyDetailRelationEntities(Utilities._getEntityFromObj(currentUserReplyDetailRelationEntity)));
    } 
  }

export default {  updateEntitySeen }