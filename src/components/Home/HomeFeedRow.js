import React, { PureComponent } from 'react';
import { View, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';

import FanVideo from '../VideoWrapper/FanVideo';
import ShareIcon from "../CommonComponents/ShareIcon";
import PepoApi from '../../services/PepoApi';
import reduxGetter from '../../services/ReduxGetters';
import CurrentUser from '../../models/CurrentUser';

import VideoBottomStatus from '../BottomStatus/VideoBottomStatus';

import inlineStyles from './styles';
import utilities from '../../services/Utilities';
import ReportVideo from "../CommonComponents/ReportVideo";
import ReplyIcon from '../CommonComponents/ReplyIcon';
import PepoTxBtn from '../PepoTransactionButton/PepoTxBtn';
import VideoSupporterStat from '../CommonComponents/VideoSupporterStat/VideoSupporterStat';
import DataContract from '../../constants/DataContract';

import InvertedReplyList from '../CommonComponents/InvertedReplyThumbnailList';


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
      <View style={[inlineStyles.fullScreen, {position: 'relative'} ]}>

        {/*<View style={{position: "absolute" , top: 50,  left: 0 , zIndex: 9 ,  height: 500, width:100}}>*/}
        {/*  /!*<FlatList style={{height: "100%", width:"100%"}}*!/*/}
        {/*  /!*          nestedScrollEnabled={true}*!/*/}
        {/*  /!*          data={[1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]}*!/*/}
        {/*  /!*          renderItem={this._renderChildItem} />*!/*/}
        {/*  < InvertedReplyList  videoId={this.videoId} userId={this.userId}/>*/}
        {/*</View>*/}



        <View style={inlineStyles.listContainer} >
          {/*<View style={inlineStyles.invertedList}  >*/}
            <View style={{ minWidth: '20%', alignSelf: 'flex-start' }}>
              < InvertedReplyList  videoId={this.videoId} userId={this.userId}/>
            </View>
          {/*</View>*/}

        </View>

        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
          <View style={inlineStyles.touchablesBtns} pointerEvents={'box-none'}>

            <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
              {/*< InvertedReplyList  videoId={this.videoId} userId={this.userId}/>*/}
                <PepoTxBtn  resyncDataDelegate={this.refetchFeed} userId={this.userId} entityId={this.videoId}/>
                <ReplyIcon videoId={this.videoId} userId={this.userId}/>
                <ShareIcon videoId={this.videoId} userId={this.userId} url={DataContract.share.getVideoShareApi(this.videoId)} />
                <ReportVideo  userId={this.userId} reportEntityId={this.videoId} reportKind={'video'} />
              </View>

            <VideoSupporterStat
              entityId={this.videoId}
              userId={this.userId}
              pageName="feed"
            />
          </View>
          <VideoBottomStatus userId={this.userId} entityId={this.videoId} />
        </View>
      </View>
    );
  }
}

export default withNavigation(HomeFeedRow);
