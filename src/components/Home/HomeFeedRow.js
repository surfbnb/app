import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';

import VideoWrapper from './VideoWrapper';
import ShareIcon from "../CommonComponents/ShareIcon";
import PepoApi from '../../services/PepoApi';
import reduxGetter from '../../services/ReduxGetters';
import TransactionPepoButton from './TransactionPepoButton';
import CurrentUser from '../../models/CurrentUser';

import BottomStatus from './BottomStatus';
import VideoAmountStat from '../CommonComponents/VideoAmoutStat';

import inlineStyles from './styles';
import utilities from '../../services/Utilities';
import ReportVideo from "../CommonComponents/ReportVideo";
import ReplyIcon from '../CommonComponents/ReplyIcon';

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

  navigateToUserProfile = (e) => {
    if (utilities.checkActiveUser()) {
      if (this.userId == CurrentUser.getUserId()) {
        this.props.navigation.navigate('ProfileScreen');
      } else {
        this.props.navigation.push('UsersProfileScreen', { userId: this.userId });
      }
    }
  };

  onDescriptionClick = ( tapEntity , tapText ) => {
    if (utilities.checkActiveUser()) {
      if (!tapEntity) {
        return;
      }

      if( tapEntity.kind === 'tags'){
        this.props.navigation.push('VideoTags', {
          "tagId": tapEntity.id
        });
      }

    }
  };


  render() {
    return (
      <View style={inlineStyles.fullScreen}>
        <VideoWrapper
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
                <TransactionPepoButton
                  resyncDataDelegate={this.refetchFeed}
                  userId={this.userId}
                  videoId={this.videoId}
                />
                <ReplyIcon videoId={this.videoId} userId={this.userId}/>
                <ShareIcon videoId={this.videoId} userId={this.userId} />
                <ReportVideo  userId={this.userId} videoId={this.videoId} />
              </View>

            <VideoAmountStat
              videoId={this.videoId}
              onWrapperClick={this.navigateToUserProfile}
              userId={this.userId}
              pageName="feed"
            />
          </View>

          <BottomStatus userId={this.userId} videoId={this.videoId} onWrapperClick={this.navigateToUserProfile} onDescriptionClick={this.onDescriptionClick} />
        </View>
      </View>
    );
  }
}

export default withNavigation(HomeFeedRow);
