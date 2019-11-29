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

const outerRingDiameter = AppConfig.thumbnailListConstants.outerRingDiameter;
const outerBorderWidth = AppConfig.thumbnailListConstants.outerBorderWidth;
const transparentGap = AppConfig.thumbnailListConstants.transparentGap;
const iconImageDiameter = AppConfig.thumbnailListConstants.iconImageDiameter();

const inlineStyle= {
  iconStyle: { height: iconImageDiameter,
            width: iconImageDiameter,
            borderRadius: iconImageDiameter/ 2,
            marginLeft: transparentGap,
            marginTop: transparentGap
  },
  wrapperStyle: {
    width: outerRingDiameter,
    height: outerRingDiameter,
    borderRadius: outerRingDiameter/ 2,
    borderWidth: outerBorderWidth,
    borderColor: 'transparent',
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
