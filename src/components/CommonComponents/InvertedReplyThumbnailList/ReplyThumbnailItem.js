import React, { Component } from 'react';
import { connect } from 'react-redux';
import deepGet from 'lodash/get';
import {View} from 'react-native';
import { Platform } from 'react-native';

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
    return <View style={{position: "relative"}}>
            <TouchableOpacity onPress={multipleClickHandler(() => { this.props.onClickHandler();})}
                  style={[inlineStyle.wrapperStyle, !this.props.seen && inlineStyle.unseen, this.props.isActive && inlineStyle.active]}>
              <ProfilePicture userId={this.userId} style={[inlineStyle.borderStyle, inlineStyle.iconStyle]}/>
            </TouchableOpacity>
          </View>
  }

  isActiveOrUnseen = () => {
    return !this.props.seen || this.props.isActive;
  }

}

const inlineStyle= {
  iconStyle: { height: AppConfig.thumbnailListConstants.iconHeight - 8,
            width: AppConfig.thumbnailListConstants.iconWidth - 8,
            borderRadius: (AppConfig.thumbnailListConstants.iconWidth - 8)/ 2,
            marginLeft: -2,
            marginTop: -2
  },
  wrapperStyle: {
    width: AppConfig.thumbnailListConstants.iconWidth,
    height: AppConfig.thumbnailListConstants.iconHeight,
    borderRadius: (AppConfig.thumbnailListConstants.iconWidth)/ 2,
    padding: 4,
    borderWidth: AppConfig.thumbnailListConstants.borderWidth,
    borderColor: 'rgba(255, 255, 255, 0)',
  },
  active: {
    borderColor: '#fff',
  },
  unseen: {
    borderColor: 'red'
  }
};

//make this component available to the app
export default connect(mapStateToProps)(ReplyThumbnailItem);
