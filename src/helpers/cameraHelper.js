import reduxGetter from "../services/ReduxGetters";
import AppConfig from '../constants/AppConfig'
import NavigationService from "../services/NavigationService";
import Utilities from "../services/Utilities";

const getVideoReplyObject = (videoId, creatorUserId) => {
  return {
    videoType : AppConfig.videoTypes.reply,
    videoId: videoId,
    userId: creatorUserId,
    amount: reduxGetter.getBtAmountForReply(videoId),
    videoReplyCount: reduxGetter.getVideoReplyCount(videoId)
  };
};


const navigateToCamera = (videoId , userId , navigation) => {
  let activeTab = NavigationService.getActiveTab();
  let params = getVideoReplyObject ( videoId , userId);
  Utilities.handleVideoUploadModal(activeTab, navigation, params);
};

export { getVideoReplyObject  , navigateToCamera }
