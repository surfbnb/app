import reduxGetter from "../services/ReduxGetters";
import AppConfig from '../constants/AppConfig'

let getVideoReplyObject = (videoId, creatorUserId) => {
  return {
    videoType : AppConfig.videoTypes.reply,
    videoId: videoId,
    userId: creatorUserId,
    amount: reduxGetter.getBtAmountForReply(videoId),
    videoReplyCount: reduxGetter.getVideoReplyCount(videoId)
  };
};


export { getVideoReplyObject }
