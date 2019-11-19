import Base from "./Base";
import React, { PureComponent } from 'react';
import reduxGetters from '../../../services/ReduxGetters';
import AppConfig from '../../../constants/AppConfig';
import deepGet from "lodash/get";

class VideoThumbnail extends PureComponent {
  constructor(props){
    super(props);
  }

  render(){
    const videoId = deepGet(this.props , "payload.video_id"),
     userId = deepGet(this.props , "payload.user_id") ,
     userName = reduxGetters.getUserName(userId),
     imageUrl = reduxGetters.getVideoImgUrl(videoId, null,  AppConfig.userVideos.userScreenCoverImageWidth) ,
     videoDesc = reduxGetters.getVideoDescription(reduxGetters.getVideoDescriptionId(videoId))
     ;
    return <Base  userName={userName} imageUrl={imageUrl} videoDesc={videoDesc} {...this.props} />;
  }
}
export default VideoThumbnail;