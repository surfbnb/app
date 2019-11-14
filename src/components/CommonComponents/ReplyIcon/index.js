import React, { PureComponent } from 'react';
import {TouchableOpacity , Image, View, Text} from "react-native";
import { connect } from 'react-redux';
import {withNavigation} from "react-navigation";

import reduxGetter from '../../../services/ReduxGetters';
import inlineStyles from './styles';
import multipleClickHandler from "../../../services/MultipleClickHandler";
import pricer from '../../../services/Pricer';
import reply_video from '../../../assets/reply_video.png';
import Utilities from '../../../services/Utilities';
import CurrentUser from '../../../models/CurrentUser';
import NavigationService from "../../../services/NavigationService";
import utilities from "../../../services/Utilities";
import { LoginPopoverActions } from '../../LoginPopover';
import Pricer from '../../../services/Pricer';

const mapStateToProps = (state , ownProps) => {
  return {
    isVideoUserActivated : Utilities.isUserActivated(reduxGetter.getUserActivationStatus(ownProps.userId)),
    isCurrentUserActivated : CurrentUser.isUserActivated(),
    balance : state.balance,
    requiredPepo : reduxGetter.getBtAmountForReply(ownProps.videoId, state),
    videoReplyCount : reduxGetter.getVideoReplyCount(ownProps.videoId, state),
    isReplyAllowed : reduxGetter.isReplyAllowed(ownProps.videoId, state),
    userName : reduxGetter.getUserName(ownProps.userId)
  }
};

class ReplyIcon extends PureComponent {

   constructor(props){
     super(props);
    };

    isDisabled = () => {
        return !this.props.isReplyAllowed || !this.props.isVideoUserActivated || !this.props.isCurrentUserActivated || !this.hasSufficientBalance();
    };

    hasSufficientBalance = () => {
        return Pricer.getWeiToNumber(this.props.balance) >= Pricer.getWeiToNumber(this.props.requiredPepo);
    };

    replyVideo = ()=> {
      if(this.isDisabled()) {
        if(!CurrentUser.getOstUserId()){
          LoginPopoverActions.show();
        }
        return;
      }

      if ( this.props.videoReplyCount > 0 ) {
        this.props.navigation.push('VideoReplies',
          {'videoId': this.props.videoId ,
            'userId': this.props.userId
          });
      } else {
        let activeTab = NavigationService.getActiveTab();
        let params = {
          videoTypeReply: true,
          videoId: this.props.videoId,
          userId: this.props.userId,
          amount: this.props.requiredPepo,
          videoReplyCount: this.props.videoReplyCount
        };
        utilities.handleVideoUploadModal(activeTab, this.props.navigation, params);
      }

    };

    render(){
        return (
        <View>
            <Text style={inlineStyles.videoReplyCount}>{this.props.videoReplyCount}</Text>
            <TouchableOpacity pointerEvents={'auto'}
                            style={inlineStyles.replyIconWrapper}
                            onPress={multipleClickHandler(() => this.replyVideo())} >
                <Image style={{ aspectRatio: 124/100, height: 35 }} source={reply_video} />
            </TouchableOpacity>
        </View>);
    }

};

export default connect(mapStateToProps)(withNavigation(ReplyIcon));
