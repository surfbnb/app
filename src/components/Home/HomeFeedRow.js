import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import VideoWrapper from './VideoWrapper';
import PepoApi from '../../services/PepoApi';
import reduxGetter from '../../services/ReduxGetters';
import TransactionPepoButton from './TransactionPepoButton';
import tx_icon from '../../assets/tx_icon.png';
import CurrentUser from '../../models/CurrentUser';

import BottomStatus from './BottomStatus';
import inlineStyles from './styles';
import multipleClickHandler from '../../services/MultipleClickHandler';

class HomeFeedRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refreshed: false,
      totalBt: this.totalBt,
      supporters: this.supporters,
      isSupported: this.isVideoSupported
    };
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
    if (CurrentUser.checkActiveUser() && CurrentUser.isUserActivated()) {
      this.props.navigation.push('TransactionScreen', {
        toUserId: this.userId,
        videoId: reduxGetter.getHomeFeedVideoId(this.props.feedId),
        requestAcknowledgeDelegate: this.refetchFeed
      });
    }
  };

  render() {
    console.log('render HomeFeedRow');
    return (
      <View style={inlineStyles.fullScreen}>
        <VideoWrapper videoId={this.videoId} doRender={this.props.doRender} isActive={this.props.isActive} />

        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
          <View style={inlineStyles.touchablesBtns}>
            <TransactionPepoButton
              refetchFeed={this.refetchFeed}
              feedId={this.props.feedId}
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
          </View>

          <BottomStatus
            userId={this.userId}
            videoId={this.videoId}
          />
        </View>
      </View>
    );
  }
}

export default withNavigation(HomeFeedRow);
