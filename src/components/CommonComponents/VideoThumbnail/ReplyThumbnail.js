import Base from "./Base";
import React, { PureComponent } from 'react';
import reduxGetters from '../../../services/ReduxGetters';
import AppConfig from '../../../constants/AppConfig';
import deepGet from "lodash/get";
import Pricer from "../../../services/Pricer";

class ReplyThumbnail extends PureComponent {
  constructor(props){
    super(props);
  }

  getReplyStats(replyId) {
    let replyBt = reduxGetters.getReplyBt(replyId);
    return Pricer.getFromDecimal(replyBt) || 0;
  }

  render(){
    const replyId = deepGet(this.props , "payload.reply_detail_id"),
     userId = deepGet(this.props , "payload.user_id") ,
     videoId = reduxGetters.getReplyEntityId( replyId ),
     userName = reduxGetters.getUserName(userId),
     imageUrl = reduxGetters.getVideoImgUrl(videoId, null,  AppConfig.userVideos.userScreenCoverImageWidth) ,
     videoDesc = reduxGetters.getVideoDescription(reduxGetters.getReplyDescriptionId(videoId)) ,
     replyBtAmount = this.getReplyStats(replyId)
     ;
    return <Base  userName={userName} imageUrl={imageUrl} videoDesc={videoDesc} btAmount={replyBtAmount} {...this.props} />;
  }
}
export default ReplyThumbnail;
