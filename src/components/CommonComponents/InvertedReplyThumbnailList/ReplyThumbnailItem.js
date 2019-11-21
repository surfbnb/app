import React, { Component } from 'react';
import ProfilePicture from "../../ProfilePicture";
import reduxGetters from '../../../services/ReduxGetters';
import { TouchableOpacity } from 'react-native-gesture-handler';

class ReplyThumbnailItem extends Component {

  constructor(props) {
    super(props);
    this.videoId = this.props.payload.video_id;
    this.replyDetailId = this.props.payload.reply_detail_id;
    this.userId = reduxGetters.getReplyEntity(this.replyDetailId).creator_user_id;
  }

  render() {
    return <TouchableOpacity onPress={this.props.onClickHandler}>
            <ProfilePicture userId={this.userId} />
          </TouchableOpacity>
  }
}

//make this component available to the app
export default ReplyThumbnailItem;
