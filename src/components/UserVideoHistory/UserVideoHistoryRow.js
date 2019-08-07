import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import VideoWrapper from '../Home/VideoWrapper';
import PepoApi from '../../services/PepoApi';
import TransactionPepoButton from '../Home/TransactionPepoButton';
import tx_icon from '../../assets/tx_icon.png';
import CurrentUser from '../../models/CurrentUser';

import BottomStatus from '../Home/BottomStatus';
import VideoAmountStat from "../CommonComponents/VideoAmoutStat";

import inlineStyles from './styles';
import multipleClickHandler from '../../services/MultipleClickHandler';

class UserVideoHistoryRow extends PureComponent {
  constructor(props) {
    super(props);
  }

  refetchVideo = () => {
    new PepoApi(`/videos/${this.props.videoId}`)
      .get()
      .then((res) => {})
      .catch((error) => {});
  };

  navigateToTransactionScreen = (e) => {
    if (this.userId == CurrentUser.getUserId()) return;
    if (CurrentUser.checkActiveUser() && CurrentUser.isUserActivated(true)) {
      this.props.navigation.push('TransactionScreen', {
        toUserId: this.props.userId,
        videoId: this.props.videoId,
        requestAcknowledgeDelegate: this.refetchVideo
      });
    }
  };

  isCurrentUser(){
      return this.props.userId == CurrentUser.getUserId();
  }

  render() {
    return (
      <View style={inlineStyles.fullScreen}>
        <VideoWrapper   userId={this.props.userId} videoId={this.props.videoId} 
                        doRender={this.props.doRender} isActive={this.props.isActive} />

        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
          
          <View style={inlineStyles.touchablesBtns}>

            {!this.isCurrentUser() && (
                <React.Fragment>
                     <TransactionPepoButton resyncDataDelegate={this.refetchVideo} userId={this.props.userId} videoId={this.props.videoId} />
                     <TouchableOpacity pointerEvents={'auto'} style={inlineStyles.txElem}
                        onPress={multipleClickHandler(() => this.navigateToTransactionScreen())}>
                        <Image style={{ height: 57, width: 57 }} source={tx_icon} />
                    </TouchableOpacity>
                </React.Fragment>    
            )}

            <VideoAmountStat  videoId={this.props.videoId} />
        
          </View>

          <BottomStatus userId={this.props.userId} videoId={this.props.videoId} />
        </View>
      </View>
    );
  }
  
}

export default withNavigation(UserVideoHistoryRow);