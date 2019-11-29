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

const outterBorderWidth     = AppConfig.thumbnailListConstants.borderWidth;
const outterRingDiameter    = AppConfig.thumbnailListConstants.iconHeight;
const transparentGap        = AppConfig.thumbnailListConstants.transparentGap;

const profileImageDiameter = outterRingDiameter - (2 * (outterBorderWidth + transparentGap ));


const inlineStyle= {
  iconStyle: { height: profileImageDiameter,
            width: profileImageDiameter,
            borderRadius: profileImageDiameter/ 2,
            marginLeft: transparentGap,
            marginTop: transparentGap
  },
  wrapperStyle: {
    width: outterRingDiameter,
    height: outterRingDiameter,
    borderRadius: outterRingDiameter/ 2,
    borderWidth: outterBorderWidth,
    borderColor: 'rgba(255, 255, 0, 1)',
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
