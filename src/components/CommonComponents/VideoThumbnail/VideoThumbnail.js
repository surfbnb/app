import Base from "./Base";
import React, { PureComponent } from 'react';
import reduxGetters from '../../../services/ReduxGetters';
import AppConfig from '../../../constants/AppConfig';
import deepGet from "lodash/get";
import Pricer from "../../../services/Pricer";

class VideoThumbnail extends PureComponent {
  constructor(props){
    super(props);
  }

  getVideoStats(videoId) {
    let videoBt = reduxGetters.getVideoBt(videoId);
    return Pricer.getFromDecimal(videoBt) || 0;
  }

  render(){
    const videoId = deepGet(this.props , "payload.video_id"),
     userId = deepGet(this.props , "payload.user_id") ,
     userName = reduxGetters.getUserName(userId),
     imageUrl = reduxGetters.getVideoImgUrl(videoId, null,  AppConfig.userVideos.userScreenCoverImageWidth) ,
     videoDesc = reduxGetters.getVideoDescription(reduxGetters.getVideoDescriptionId(videoId)) ,
     videoBtAmount = this.getVideoStats(videoId)
     ;
    return <Base  userName={userName} imageUrl={imageUrl} videoDesc={videoDesc} btAmount={videoBtAmount} {...this.props} />;
  }
}
export default VideoThumbnail;
