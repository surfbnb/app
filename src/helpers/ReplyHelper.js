import deepGet from 'lodash/get';

import store from '../store';
import ReduxGetters from "../services/ReduxGetters";
import { upsertCurrentUserVideoRelationEntities } from '../reducers';
import Utilities from '../services/Utilities';


function updateEntitySeen (item) {
    const entityId = ReduxGetters.getReplyEntityId(deepGet(item,'payload.reply_detail_id'));
    let currentUserVideoRelationEntity = ReduxGetters.getCurrentUserVideoRelationEntity( entityId );
    if(currentUserVideoRelationEntity){
      currentUserVideoRelationEntity['has_seen'] = true;
      store.dispatch(upsertCurrentUserVideoRelationEntities(Utilities._getEntityFromObj(currentUserVideoRelationEntity)));
    } 
  }

export default {  updateEntitySeen }