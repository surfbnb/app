import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import FanVideo from '../VideoWrapper/FanVideo';
import ShareIcon from "../CommonComponents/ShareIcon";
import ReportVideo from "../CommonComponents/ReportVideo";
import PepoApi from '../../services/PepoApi';
import findCurrentRoute from '../../services/NavigationService';

import CurrentUser from '../../models/CurrentUser';

import VideoBottomStatus from '../BottomStatus/VideoBottomStatus';
import inlineStyles from './styles';

import utilities from '../../services/Utilities';
import ReplyIcon from '../CommonComponents/ReplyIcon';
import PepoTxBtn from '../PepoTransactionButton/PepoTxBtn';
import VideoSupporterStat from '../CommonComponents/VideoSupporterStat/VideoSupporterStat';
import DataContract from '../../constants/DataContract';
import BottomReplyBar from '../CommonComponents/BottomReplyBar';
import CommonStyle from "../../theme/styles/Common";

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
    if (this.isCurrentUser()) return;
    if (utilities.checkActiveUser() && CurrentUser.isUserActivated(true)) {
      this.props.navigation.push('TransactionScreen', {
        toUserId: this.props.userId,
        videoId: this.props.videoId,
        requestAcknowledgeDelegate: this.refetchVideo
      });
    }
  };

  isCurrentUser() {
    return this.props.userId == CurrentUser.getUserId();
  }

  getPType() {
    if(findCurrentRoute(this.props.navigation.state) === 'VideoPlayer'){
      return 'video_player';
    } else {
      return 'user_profile';
    }
  }

  render() {
    return (
      <View style={CommonStyle.fullScreen}>

                <View style={CommonStyle.videoWrapperfullScreen}>
                    <FanVideo
                      shouldPlay={this.props.shouldPlay}
                      userId={this.props.userId}
                      videoId={this.props.videoId}
                      doRender={this.props.doRender}
                      isActive={this.props.isActive}
                    />

                    {!!this.props.videoId && !!this.props.userId && (
                      <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
                        <View style={inlineStyles.touchablesBtns}>

                          <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                            <PepoTxBtn
                              resyncDataDelegate={this.refetchVideo}
                              userId={this.props.userId}
                              entityId={this.props.videoId}
                              getPixelDropData={() => {p_type: this.getPType()}}
                            />
                            <ReplyIcon videoId={this.props.videoId} userId={this.props.userId}/>
                            <ShareIcon  userId={this.props.userId} videoId={this.props.videoId} url={DataContract.share.getVideoShareApi(this.videoId)} />
                            <ReportVideo  userId={this.props.userId} reportEntityId={this.props.videoId} reportKind={'video'} />
                          </View>

                          <VideoSupporterStat
                            entityId={this.props.videoId}
                            userId={this.props.userId}
                          />
                        </View>

                        <VideoBottomStatus
                          userId={this.props.userId}
                          entityId={this.props.videoId}
                        />
                      </View>
                    )}
                  </View>

            <BottomReplyBar  userId={this.props.userId}  videoId={this.props.videoId}/>
      </View>
    );
  }
}

export default withNavigation(UserVideoHistoryRow);
