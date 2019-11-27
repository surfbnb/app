import React, { Component } from 'react';
import { connect } from 'react-redux';
import deepGet from 'lodash/get';

import ProfilePicture from "../../ProfilePicture";
import reduxGetters from '../../../services/ReduxGetters';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppConfig from '../../../constants/AppConfig';
import multipleClickHandler from '../../../services/MultipleClickHandler';

const mapStateToProps = (state, ownProps) => {
  return {
      seen: reduxGetters.isReplySeen( deepGet(ownProps.payload,'reply_detail_id'))
    };
};

class ReplyThumbnailItem extends Component {

  constructor(props) {
    super(props);
    this.videoId = this.props.payload.video_id;
    this.replyDetailId = this.props.payload.reply_detail_id;
    this.userId = reduxGetters.getReplyEntity(this.replyDetailId).creator_user_id;
  }

  render() {
    return <TouchableOpacity onPress={multipleClickHandler(() => { this.props.onClickHandler();})}
                  style={[ this.isActiveOrUnseen() && inlineStyle.wrapperStyle, !this.props.seen && inlineStyle.unseen, this.props.isActive && inlineStyle.active]}>
              <ProfilePicture userId={this.userId} style={[inlineStyle.borderStyle, inlineStyle.iconStyle]}/>
          </TouchableOpacity>
  }

  isActiveOrUnseen = () => {
    return !this.props.seen || this.props.isActive;
  }

}

const inlineStyle= {
  iconStyle: { height: AppConfig.thumbnailListConstants.iconHeight - 8,
            width: AppConfig.thumbnailListConstants.iconWidth - 8,
            borderRadius: (AppConfig.thumbnailListConstants.iconWidth - 8)/ 2
  },
  borderStyle: {
    borderWidth: 1,
    borderColor: '#fff'
  },
  wrapperStyle: {
    width: AppConfig.thumbnailListConstants.iconWidth  ,
    height:AppConfig.thumbnailListConstants.iconHeight  ,
    borderRadius: (AppConfig.thumbnailListConstants.iconWidth)/ 2,
    padding: 4
  },
  active: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden'
  },
  unseen: {
    shadowColor: '#ff5566',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden'
  }
}

//make this component available to the app
export default connect(mapStateToProps)(ReplyThumbnailItem);
