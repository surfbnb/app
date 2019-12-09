import store from '../store';
import ReduxGetters from "../services/ReduxGetters";
import { upsertCurrentUserReplyDetailRelationEntities } from '../reducers';
import Utilities from '../services/Utilities';
import DataContract from '../constants/DataContract';


function updateEntitySeen (replyDetailId) {
    let currentUserReplyDetailRelationEntity = ReduxGetters.getReplyDetailRelationEntity( replyDetailId );
    if(currentUserReplyDetailRelationEntity){
      currentUserReplyDetailRelationEntity['has_seen'] = true;
      store.dispatch(upsertCurrentUserReplyDetailRelationEntities(Utilities._getEntityFromObj(currentUserReplyDetailRelationEntity)));
    } 
  }

export default {  updateEntitySeen }