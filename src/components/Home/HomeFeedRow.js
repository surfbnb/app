import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import VideoWrapper from './VideoWrapper';
import PepoApi from '../../services/PepoApi';
import reduxGetter from '../../services/ReduxGetters';
import TransactionPepoButton from './TransactionPepoButton';
import tx_icon from '../../assets/tx_icon.png';
import pricer from '../../services/Pricer';
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

  get supporters() {
    return Number(reduxGetter.getVideoSupporters(this.videoId)) || 0;
  }

  get totalBt() {
    return pricer.getToBT(pricer.getFromDecimal(reduxGetter.getVideoBt(this.videoId)), 2);
  }

  get isVideoSupported() {
    return reduxGetter.isVideoSupported(this.videoId);
  }

  onLocalUpdate = (totalBt) => {
    let newState = { totalBt: totalBt };
    if (!this.isVideoSupported) {
      newState['supporters'] = this.supporters + 1;
      newState['isSupported'] = true;
    }
    this.setState(newState);
  };

  onLocalReset = (totalBt) => {
    let newState = { totalBt: totalBt };
    if (!this.isVideoSupported) {
      newState['supporters'] = this.supporters;
      newState['isSupported'] = false;
    }
    this.setState(newState);
  };

  refetchFeed = () => {
    this.state.refreshed = true; // change silently
    new PepoApi(`/feeds/${this.props.feedId}`)
      .get()
      .then((res) => {
        this.onRefresh();
      })
      .catch((error) => {});
  };

  onRefresh() {
    let newState = { totalBt: this.totalBt, suporters: this.supporters, refreshed: false };
    this.setState(newState);
  }

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
              totalBt={this.state.totalBt}
              isSupported={this.state.isSupported}
              onLocalUpdate={this.onLocalUpdate}
              onLocalReset={this.onLocalReset}
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
            supporters={this.state.supporters}
            videoId={this.videoId}
            totalBt={this.state.totalBt}
          />
        </View>
      </View>
    );
  }
}

export default withNavigation(HomeFeedRow);
