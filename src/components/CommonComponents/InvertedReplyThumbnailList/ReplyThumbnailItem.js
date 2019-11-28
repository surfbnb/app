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

  _renderTopMiniSeperator() {
    //NOTE: Deliberately treating cellIndex as falsey.
    if (!this.props.cellIndex) {
      return null;
    }

    return <View style={[inlineStyle.miniSeparator,{top:0}]}></View>
  }
  _renderBottomMiniSeperator() {
    if (this.props.cellIndex == this.props.totalCells - 1) {
      return null;
    }
    return <View style={[inlineStyle.miniSeparator,{bottom:0}]}></View>
  }
  render() {
    return <View style={{position: "relative"}}>
            {/*{this._renderTopMiniSeperator()}*/}
            <TouchableOpacity onPress={multipleClickHandler(() => { this.props.onClickHandler();})}
                  style={[inlineStyle.wrapperStyle, !this.props.seen && inlineStyle.unseen, this.props.isActive && inlineStyle.active]}>
              <ProfilePicture userId={this.userId} style={[inlineStyle.borderStyle, inlineStyle.iconStyle]}/>
            </TouchableOpacity>
            {/*{this._renderBottomMiniSeperator()}*/}
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
            marginTop: -2,
    // ...Platform.select({
    //   android: {
    //     marginLeft: -4,
    //     marginTop: -4,
    //   },
    // })
  },
  // borderStyle: {
  //   borderWidth: 1,
  //   borderColor: '#fff'
  // },
  wrapperStyle: {
    width: AppConfig.thumbnailListConstants.iconWidth,
    height: AppConfig.thumbnailListConstants.iconHeight,
    borderRadius: (AppConfig.thumbnailListConstants.iconWidth)/ 2,
    padding: 4,
    borderWidth: AppConfig.thumbnailListConstants.borderWidth,
    borderColor: 'transparent',
    // shadowColor: 'transparent',
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 1,
    // shadowRadius: 4,
    // overflow: 'hidden',
    // ...Platform.select({
    //   android: {
    //     borderWidth: 2,
    //     borderColor: 'transparent',
    //     width: AppConfig.thumbnailListConstants.iconWidth - 4,
    //     height:AppConfig.thumbnailListConstants.iconHeight - 4,
    //     zIndex: 1,
    //     borderRadius: (AppConfig.thumbnailListConstants.iconWidth - 4) / 2
    //   },
    // })
  },
  active: {
    shadowColor: '#fff',
    borderColor: '#fff'
  },
  unseen: {
    shadowColor: 'red',
    borderColor: 'red'
  },
  miniSeparator: {
    position: 'absolute',
    left: '50%',
    width: 1,
    marginLeft: -0.5,
    backgroundColor: 'white',
    height: 4
  }
};

//make this component available to the app
export default connect(mapStateToProps)(ReplyThumbnailItem);
