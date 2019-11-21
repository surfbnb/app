import { FetchServices } from "../services/FetchServices";
import DataContract from "../constants/DataContract";
import ReduxGetters from "../services/ReduxGetters";

async function openRepliesList( parentUserId, parentVideoId, fetchServicesClonedInstance, currentIndex, navigation){
    navigation.push('FullScreenReplyCollection',{
      "fetchServices": fetchServicesClonedInstance,
      "currentIndex": currentIndex,
      "baseUrl": DataContract.replies.getReplyListApi(parentVideoId),
      'userId': parentUserId,
      'videoId': parentVideoId
    });
}

export default { openRepliesList }