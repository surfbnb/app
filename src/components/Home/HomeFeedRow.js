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
    this.state ={
      yCoordinateOfReportButton : 0
    }
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

  componentDidMount() {
    setTimeout(()=>{
      this.measureWindow();
    }, 10);
  };


  componentDidUpdate(prevProps) {

    if (prevProps.isActive !== this.props.isActive){
      this.measureWindow();
    }

  };

  measureWindow = () => {
    if (this.props.isActive === true){
      console.log('measureWindow:::isActive true', this.videoId);
      this.reportViewRef.measureInWindow(this.calculateYCoordinateOfReportButton);
    }
  };


  calculateYCoordinateOfReportButton = (ox, oy, width, height) => {
    this.setState({yCoordinateOfReportButton: oy});
    console.log('============== measurePosition ==============' );
    console.log('ox',ox);
    console.log('oy',oy);
    console.log('width',width);
    console.log('height',height);
    console.log('============== measurePosition ==============' );
  };

  render() {
    return (
      <View style={[inlineStyles.fullScreen, {position: 'relative'} ]}>

        <FanVideo
          shouldPlay={this.props.shouldPlay}
          userId={this.userId}
          videoId={this.videoId}
          doRender={this.props.doRender}
          isActive={this.props.isActive}
        />



        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
          <View style={{flexDirection:'row', justifyContent: 'space-between'}}>

            <View style={{   left: 10, zIndex: 9, minWidth: '20%', alignSelf: 'flex-start', bottom:60 }}>
              <InvertedReplyList  videoId={this.videoId}
                                   userId={this.userId}
                                   doRender={this.props.doRender}
                                   availableHeight={this.state.yCoordinateOfReportButton}/>
            </View>

          <View style={inlineStyles.touchablesBtns} pointerEvents={'box-none'}>

            <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }} >
              {/*< InvertedReplyList  videoId={this.videoId} userId={this.userId}/>*/}
                <PepoTxBtn  resyncDataDelegate={this.refetchFeed} userId={this.userId} entityId={this.videoId}/>
                <ReplyIcon videoId={this.videoId} userId={this.userId}/>

                <ShareIcon videoId={this.videoId}
                           userId={this.userId}
                           url={DataContract.share.getVideoShareApi(this.videoId)}
                />
                <View ref={(ref)=> {this.reportViewRef = ref }} onLayout={()=>{}} >
                <ReportVideo  userId={this.userId} reportEntityId={this.videoId} reportKind={'video'} />
                </View>
              </View>

            <VideoSupporterStat
              entityId={this.videoId}
              userId={this.userId}
              pageName="feed"
            />
          </View>
          </View>
          <VideoBottomStatus userId={this.userId} entityId={this.videoId} />
        </View>
      </View>
    );
  }
}

export default withNavigation(HomeFeedRow);
