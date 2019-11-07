import React, { PureComponent } from 'react';
import {TouchableOpacity , Image, View, Text} from "react-native";
import { connect } from 'react-redux';

import reduxGetter from '../../../services/ReduxGetters';
import inlineStyles from './styles';
import multipleClickHandler from "../../../services/MultipleClickHandler";
import pricer from '../../../services/Pricer';
import reply_video from '../../../assets/reply_video.png';
import Utilities from '../../../services/Utilities';
import CurrentUser from '../../../models/CurrentUser';

const mapStateToProps = (state , ownProps) => {
  return {
    isCreatorApproved :  reduxGetter.isCreatorApproved(ownProps.userId),
    isVideoUserActivated : Utilities.isUserActivated(reduxGetter.getUserActivationStatus(ownProps.userId)),
    isCurrentUserActivated : CurrentUser.isUserActivated(),
    balance : state.balance,
    requiredPepo : reduxGetter.getVideoReplyAmount(ownProps.videoId, state),
    videoReplyCount : reduxGetter.getVideoReplyCount(ownProps.videoId, state)
  }
};

class ReplyVideo extends PureComponent {

   constructor(props){
     super(props);
    };

    isDisabled = () => {
        return this.props.isCreatorApproved != 1 || !this.props.isVideoUserActivated || !this.props.isCurrentUserActivated || !this.hasSufficientBalance();
    };

    hasSufficientBalance = () => {
        return this.getBalanceToNumber() >= this.props.requiredPepo ? true : false;
    };

    getBalanceToNumber = () => {
        return (this.props.balance && Math.floor(Number(pricer.getFromDecimal(this.props.balance)))) || 0;
    };

    replyVideo = ()=> {
        
    };

    render(){
        return (
        <View>
            <Text style={inlineStyles.videoReplyCount}>{this.props.videoReplyCount}</Text>
            <TouchableOpacity pointerEvents={'auto'}
                            disabled={this.isDisabled()}
                            style={inlineStyles.replyIconWrapper}
                            onPress={multipleClickHandler(() => this.replyVideo())} >
                <Image style={{ aspectRatio: 124/100, height: 35 }} source={reply_video} />
            </TouchableOpacity>
        </View>);
    }

};

export default connect(mapStateToProps)(ReplyVideo);
