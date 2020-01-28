import Base from "./Base";
import React, { PureComponent } from 'react';
import reduxGetters from '../../../services/ReduxGetters';
import AppConfig from '../../../constants/AppConfig';
import deepGet from "lodash/get";
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
     isPinned = deepGet(this.props , "payload.is_pinned")
    return <Base  userName={userName} imageUrl={imageUrl}
                  videoDesc={videoDesc}
                  userId={userId} {...this.props}
                  isPinned={isPinned}
                  pepoAmount={<VideoPepoAmount entityId={videoId} />}/>;
  }
}
export default VideoThumbnail;
