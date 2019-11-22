import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import deepGet from 'lodash/get';

import ProfilePicture from "../../ProfilePicture";
import reduxGetters from '../../../services/ReduxGetters';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReduxGetters from '../../../services/ReduxGetters';

const mapStateToProps = (state, ownProps) => {
  return {
      seen: ReduxGetters.getReplyEntitySeen( deepGet(ownProps.payload,'reply_detail_id'))
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
    return <TouchableOpacity onPress={this.props.onClickHandler}>
            <View style={[inlineStyle.shadowWrapperStyle, !this.props.seen && inlineStyle.unseen, this.props.isActive() && inlineStyle.active]}>
              <ProfilePicture userId={this.userId} style={[inlineStyle.borderStyle, inlineStyle.iconStyle]}/>
            </View>
          </TouchableOpacity>
  }
}

const inlineStyle= {
  iconStyle: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  borderStyle: {
    borderWidth: 2,
    borderColor: '#fff'
  },
  shadowWrapperStyle: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  active: {
    shadowColor: '#fff',
    shadowOffset: {
      width: -5,
      height: 3
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    borderRadius: 30
  },
  unseen: {
    shadowColor: 'red',
    shadowOffset: {
      width: -5,
      height: 3
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    borderRadius: 30
  }
}

//make this component available to the app
export default connect(mapStateToProps)(ReplyThumbnailItem);
