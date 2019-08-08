import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image , TouchableWithoutFeedback} from 'react-native';
import { withNavigation } from 'react-navigation';

import VideoWrapper from './VideoWrapper';
import PepoApi from '../../services/PepoApi';
import reduxGetter from '../../services/ReduxGetters';
import TransactionPepoButton from './TransactionPepoButton';
import tx_icon from '../../assets/tx_icon.png';
import CurrentUser from '../../models/CurrentUser';

import BottomStatus from './BottomStatus';
import VideoAmountStat from "../CommonComponents/VideoAmoutStat";

import inlineStyles from './styles';
import multipleClickHandler from '../../services/MultipleClickHandler';

class HomeFeedRow extends PureComponent {
  constructor(props) {
    super(props);
  }

  get userId() {
    return reduxGetter.getHomeFeedUserId(this.props.feedId);
  }

  get videoId() {
    return reduxGetter.getHomeFeedVideoId(this.props.feedId);
  }

  refetchFeed = () => {
    new PepoApi(`/feeds/${this.props.feedId}`)
      .get()
      .then((res) => {})
      .catch((error) => {});
  };

  navigateToTransactionScreen = (e) => {
    if (this.userId == CurrentUser.getUserId()) return;
    if (CurrentUser.checkActiveUser() && CurrentUser.isUserActivated(true)) {
      this.props.navigation.push('TransactionScreen', {
        toUserId: this.userId,
        videoId: reduxGetter.getHomeFeedVideoId(this.props.feedId),
        requestAcknowledgeDelegate: this.refetchFeed
      });
    }
  };

  navigateToUserProfile = (e) => {
    if (CurrentUser.checkActiveUser()) {
      if (this.userId == CurrentUser.getUserId()) {
        this.props.navigation.navigate('ProfileScreen');
      } else {
        this.props.navigation.push('UsersProfileScreen', { userId: this.userId });
      }
    }
  };

  render() {
    return (
      <View style={inlineStyles.fullScreen}>
        <VideoWrapper userId={this.userId} videoId={this.videoId} doRender={this.props.doRender} isActive={this.props.isActive} />

        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
         
          <View style={inlineStyles.touchablesBtns} pointerEvents={'box-none'}>
            <View style={{minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end'}}>
              <TransactionPepoButton resyncDataDelegate={this.refetchFeed} userId={this.userId} videoId={this.videoId}/>
              <TouchableOpacity pointerEvents={'auto'} onPress={multipleClickHandler(() => this.navigateToTransactionScreen())}
                                style={inlineStyles.txElem} >
                <Image style={{ height: 57, width: 57 }} source={tx_icon} />
              </TouchableOpacity>
            </View>
            <VideoAmountStat  videoId={this.videoId} />
          </View>

          <BottomStatus userId={this.userId} videoId={this.videoId} onWrapperClick={this.navigateToUserProfile}/>
      
        </View>
      </View>
    );
  }
  
}

export default withNavigation(HomeFeedRow);
