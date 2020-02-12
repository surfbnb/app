import deepGet from 'lodash/get';
import DataContract from '../constants/DataContract';
import ReduxGetters from '../services/ReduxGetters';

class EntityHelper {

    getEntityType( entity ){
        const type = deepGet(entity,`${DataContract.videos.kindKey}`);
        return type;
    }

    getReplyKind( entity ){
        const replyDetailId = deepGet(entity,`payload.${DataContract.replies.replyDetailIdKey}`); 
        const replyKind = ReduxGetters.getReplyKind(replyDetailId);
        return replyKind;
    }

    isVideoEntity( entity ){
        const type = this.getEntityType(entity);
        return type == DataContract.videos.videoKind.video;
    }

    isVideoReplyEntity( entity ){
        const type = this.getEntityType(entity);
        return type == DataContract.videos.videoKind.reply;
    }

    isUserVideoReplyEntity( entity ){
        const type = this.getEntityType(entity);
        return type == DataContract.videos.videoKind.user_reply;
    }

    isReplyVideoTypeEntity( entity ){
        const replyKind = this.getReplyKind( entity );
        return replyKind == DataContract.replies.videoReplyKind.video;
    }

}

export default new EntityHelper();