import Base from "./Base";
import React, { PureComponent } from 'react';
import reduxGetters from '../../../services/ReduxGetters';
import AppConfig from '../../../constants/AppConfig';
import deepGet from "lodash/get";
import Pricer from "../../../services/Pricer";
import {VideoPepoAmount} from '../../CommonComponents/PepoAmount'

class VideoThumbnail extends PureComponent {
  constructor(props){
    super(props);
  }

  render(){
    const videoId = deepGet(this.props , "payload.video_id"),
     userId = deepGet(this.props , "payload.user_id") ,
     userName = reduxGetters.getUserName(userId),
     imageUrl = reduxGetters.getVideoImgUrl(videoId, null,  AppConfig.userVideos.userScreenCoverImageWidth) ,
     videoDesc = reduxGetters.getVideoDescription(reduxGetters.getVideoDescriptionId(videoId)) ;
    return <Base  userName={userName} imageUrl={imageUrl}
                  videoDesc={videoDesc}
                  userId={userId} {...this.props}
                  pepoAmount={<VideoPepoAmount entityId={videoId} />}/>;
  }
}
export default VideoThumbnail;
