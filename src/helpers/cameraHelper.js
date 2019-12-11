import AppConfig from '../constants/AppConfig'
import NavigationService from "../services/NavigationService";
import Utilities from "../services/Utilities";
import CurrentUser from "../models/CurrentUser";
import { ostErrors } from "../services/OstErrors";
import Pricer from "../services/Pricer";
import ReduxGetters from "../services/ReduxGetters";
import Toast from  '../theme/components/NotificationToast';
import {fetchVideo} from "./helpers";
import PepoApi from "../services/PepoApi";
import deepGet from "lodash/get";
import PixelCall from "../services/PixelCall";

const getTagsObject = (object = {}) =>  {
  let tagArray = [];
  for (let key in object){
      if (object[key].kind === 'tags'){
        tagArray.push(key);
      }
  }
  return {tags: tagArray.join(", "), tagsLength: tagArray.length }
};


// creatorUserId is mandatory as without it token holder address can not be accessed.
const getVideoReplyObject = (videoId, creatorUserId) => {
  return {
    videoType : AppConfig.videoTypes.reply,
    videoId: videoId,
    userId: creatorUserId,
    amount: ReduxGetters.getBtAmountForReply(videoId),
    videoReplyCount: ReduxGetters.getVideoReplyCount(videoId),
    isChargeble: ReduxGetters.isVideoIsChargeable(videoId),
    toTokenHolderAddress:  ReduxGetters.getUser( creatorUserId ).ost_token_holder_address
  };
};


const navigateToCamera = (videoId , userId , navigation) => {
  let activeTab = NavigationService.getActiveTab();
  let params = getVideoReplyObject ( videoId , userId);
  Utilities.handleVideoUploadModal(activeTab, navigation, params);
};

const getPixelDataOnFanVideoSuccess = (RecorderObject, videoId ) => {
    fetchVideo(videoId,
      (res)=> {
        if (res && res.success){
          let videoLength = RecorderObject.video_length,
            creatorUserId = ReduxGetters.getVideoCreatorUserId(videoId),
          isApprovedCreator = ReduxGetters.isCreatorApproved(creatorUserId),
            hasLink = !!ReduxGetters.getVideoLinkId(videoId),
            descId = ReduxGetters.getVideoDescriptionId(videoId),
            descriptionObject = ReduxGetters.getVideoDescriptionObject(descId),
            descIncludes = descriptionObject && descriptionObject.includes,
            tagsObject = getTagsObject(descIncludes);
          let obj = {
            e_entity: "video",
            e_action: "create",
            p_type: "video_recorder",
            approved_creator: isApprovedCreator
          };

          if(videoLength){
            obj['length'] = videoLength;
          }

          if(hasLink){
            obj['has_link'] = hasLink;
          }

          if (videoId){
            obj['video_id'] = videoId;
          }
          if (tagsObject.tagsLength){
            obj['tag_count'] = tagsObject.tagsLength;
          }
          if (tagsObject.tags){
            obj['tags'] = tagsObject.tags;
          }


          PixelCall(obj);

        } else {
          // do nothing
        }
      }, ()=>{
        // do nothing
      })
};



const getPixelDataOnReplyVideoSuccess = (RecorderObject) => {

  let replyDetailId = deepGet(RecorderObject , 'reply_obj.replyDetailId' );

    new PepoApi(`/replies/${replyDetailId}`)
      .get()
      .then((res) => {

        if(res && res.success){

          let videoLength = RecorderObject.video_length,
            parentVideoId = ReduxGetters.getReplyParentVideoId(replyDetailId),
            // videoId = ReduxGetters.getReplyEntityId(replyDetailId),
            replyEntity = ReduxGetters.getReplyEntity(replyDetailId),
            creatorUserId = replyEntity.creator_user_id,
            isApprovedCreator = ReduxGetters.isCreatorApproved(creatorUserId),
            hasLink = replyEntity.link_ids  && replyEntity.link_ids.length > 0,
            descId = replyEntity.description_id,
            descriptionObject = ReduxGetters.getVideoDescriptionObject(descId),
            descIncludes = descriptionObject && descriptionObject.includes,
            tagsObject = getTagsObject(descIncludes);


          let obj = {
            e_entity: "reply",
            e_action: "create",
            p_type: "video_recorder",
            p_name: parentVideoId,
            approved_creator: isApprovedCreator
          };

          if( videoLength ) {
            obj['length'] = videoLength;
          }

          if(hasLink){
            obj['has_link'] = hasLink;
          }

          if (tagsObject.tagsLength){
            obj['tag_count'] = tagsObject.tagsLength;
          }
          if (tagsObject.tags){
            obj['tags'] = tagsObject.tags;
          }

          PixelCall(obj);

        } else {
          // do nothing
        }
      })
      .catch((error) => {
        // do nothing
      });

};

const replyPreValidationAndMessage = (videoId , userId) => {

  if(!videoId || !userId){
    console.warn("replyPreValidationAndMessage missing videoId - "  + videoId +   "or userId - " +  userId  );
    return false;
  }

  if(!CurrentUser.isUserActivated( true )){
    return false;
  }

  const isReplyAllowed = ReduxGetters.isReplyAllowed(videoId) , 
  isVideoUserActivated = Utilities.isUserActivated(ReduxGetters.getUserActivationStatus(userId))
   ;

  if( !isReplyAllowed || !isVideoUserActivated ){
    Toast.show({
      text: ostErrors.getUIErrorMessage("video_reply_not_allowed"),
      icon: 'error'
    });
    return false;
  }

  const requiredPepo = ReduxGetters.getBtAmountForReply(videoId);

  if( ReduxGetters.isVideoIsChargeable(videoId) && (Pricer.getWeiToNumber(ReduxGetters.getBalance()) < Pricer.getWeiToNumber(requiredPepo))){
    Toast.show({
      text: ostErrors.getUIErrorMessage("video_reply_not_allowed_low_bal"),
      icon: 'error'
    });
    return false ;
  }

  return true;

}


export { getVideoReplyObject  , navigateToCamera  , replyPreValidationAndMessage, getPixelDataOnFanVideoSuccess, getPixelDataOnReplyVideoSuccess}
