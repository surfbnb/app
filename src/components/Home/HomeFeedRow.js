import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';

import FanVideo from '../VideoWrapper/FanVideo';
import ShareIcon from "../CommonComponents/ShareIcon";
import PepoApi from '../../services/PepoApi';
import reduxGetter from '../../services/ReduxGetters';
import CurrentUser from '../../models/CurrentUser';

import VideoBottomStatus from '../BottomStatus /VideoBottomStatus';

import inlineStyles from './styles';
import utilities from '../../services/Utilities';
import ReportVideo from "../CommonComponents/ReportVideo";
import ReplyIcon from '../CommonComponents/ReplyIcon';
import PepoTxBtn from '../PepoTransactionButton/PepoTxBtn';
import VideoSupporterStat from '../CommonComponents/VideoSupporterStat/VideoSupporterStat';


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

  render() {
    return (
      <View style={inlineStyles.fullScreen}>
        <FanVideo
          userId={this.userId}
          videoId={this.videoId}
          feedId={this.props.feedId}
          doRender={this.props.doRender}
          isActive={this.props.isActive}
          shouldPlay={this.props.shouldPlay}
        />

        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
          <View style={inlineStyles.touchablesBtns} pointerEvents={'box-none'}>

              <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                <PepoTxBtn  resyncDataDelegate={this.refetchFeed} userId={this.userId} entityId={this.videoId}/>
                <ReplyIcon videoId={this.videoId} userId={this.userId}/>
                <ShareIcon videoId={this.videoId} userId={this.userId} />
                <ReportVideo  userId={this.userId} videoId={this.videoId} />
              </View>

            <VideoSupporterStat
              videoId={this.videoId}
              userId={this.userId}
              pageName="feed"
            />
          </View>

          <VideoBottomStatus userId={this.userId} videoId={this.videoId} />
        </View>
      </View>
    );
  }
}

export default withNavigation(HomeFeedRow);
