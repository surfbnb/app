import Base from "./Base";
import React, { PureComponent } from 'react';
import reduxGetters from '../../../services/ReduxGetters';
import AppConfig from '../../../constants/AppConfig';
import deepGet from "lodash/get";
import {ReplyPepoAmount} from '../../CommonComponents/PepoAmount'

class ReplyThumbnail extends PureComponent {
  constructor(props){
    super(props);
  }


  render(){
    const replyId = deepGet(this.props , "payload.reply_detail_id"),
     userId = deepGet(this.props , "payload.user_id") ,
     videoId = reduxGetters.getReplyEntityId( replyId ),
     userName = reduxGetters.getUserName(userId),
     imageUrl = reduxGetters.getVideoImgUrl(videoId, null,  AppConfig.userVideos.userScreenCoverImageWidth) ,
     videoDesc = reduxGetters.getVideoDescription(reduxGetters.getReplyDescriptionId(replyId));
     isPinned = deepGet(this.props , "payload.is_pinned")
    return <Base userId={userId} userName={userName}
                 imageUrl={imageUrl} videoDesc={videoDesc}
                 isPinned={isPinned}
                 pepoAmount={<ReplyPepoAmount entityId={replyId} />}
                  {...this.props}

    />;
  }
}
export default ReplyThumbnail;
