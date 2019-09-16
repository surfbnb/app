import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';

import VideoWrapper from './VideoWrapper';
import PepoApi from '../../services/PepoApi';
import reduxGetter from '../../services/ReduxGetters';
import TransactionPepoButton from './TransactionPepoButton';
import tx_icon from '../../assets/tx_icon.png';
import share_icon from '../../assets/share_icon.png';
import CurrentUser from '../../models/CurrentUser';
import ShareVideo from '../../services/shareVideo';

import BottomStatus from './BottomStatus';
import VideoAmountStat from '../CommonComponents/VideoAmoutStat';

import inlineStyles from './styles';
import multipleClickHandler from '../../services/MultipleClickHandler';
import utilities from '../../services/Utilities';

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
    if (utilities.checkActiveUser() && CurrentUser.isUserActivated(true)) {
      this.props.navigation.push('TransactionScreen', {
        toUserId: this.userId,
        videoId: reduxGetter.getHomeFeedVideoId(this.props.feedId),
        requestAcknowledgeDelegate: this.refetchFeed
      });
    }
  };

  isCurrentUser() {
    return this.userId == CurrentUser.getUserId();
  }

  navigateToUserProfile = (e) => {
    if (utilities.checkActiveUser()) {
      if (this.userId == CurrentUser.getUserId()) {
        this.props.navigation.navigate('ProfileScreen');
      } else {
        this.props.navigation.push('UsersProfileScreen', { userId: this.userId });
      }
    }
  };

  shareVideo = () => {
    let shareVideo = new ShareVideo(this.videoId);
    shareVideo.perform();
  };

  render() {
    return (
      <View style={inlineStyles.fullScreen}>
        <VideoWrapper
          userId={this.userId}
          videoId={this.videoId}
          doRender={this.props.doRender}
          isActive={this.props.isActive}
        />

        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
          <View style={inlineStyles.touchablesBtns} pointerEvents={'box-none'}>
            {!this.isCurrentUser() && (
              <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                <TransactionPepoButton
                  resyncDataDelegate={this.refetchFeed}
                  userId={this.userId}
                  videoId={this.videoId}
                />
                <TouchableOpacity
                  pointerEvents={'auto'}
                  onPress={multipleClickHandler(() => this.navigateToTransactionScreen())}
                  style={inlineStyles.txElem}
                >
                  <Image style={{ height: 57, width: 57 }} source={tx_icon} />
                </TouchableOpacity>

                <TouchableOpacity pointerEvents={'auto'} onPress={this.shareVideo} style={inlineStyles.txElem}>
                  <Image style={{ height: 48, width: 48 }} source={share_icon} />
                </TouchableOpacity>
              </View>
            )}

            {this.isCurrentUser() && (
              <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>                
                <TouchableOpacity pointerEvents={'auto'} onPress={this.shareVideo} style={inlineStyles.txElem}>
                  <Image style={{ height: 48, width: 48 }} source={share_icon} />
                </TouchableOpacity>
              </View>
            )}

            <VideoAmountStat
              videoId={this.videoId}
              onWrapperClick={this.navigateToUserProfile}
              userId={this.userId}
              pageName="feed"
            />
          </View>

          <BottomStatus userId={this.userId} videoId={this.videoId} onWrapperClick={this.navigateToUserProfile} />
        </View>
      </View>
    );
  }
}

export default withNavigation(HomeFeedRow);
