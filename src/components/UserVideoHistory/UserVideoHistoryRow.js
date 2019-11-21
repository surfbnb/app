import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import FanVideo from '../VideoWrapper/FanVideo';
import ShareIcon from "../CommonComponents/ShareIcon";
import ReportVideo from "../CommonComponents/ReportVideo";
import PepoApi from '../../services/PepoApi';

import CurrentUser from '../../models/CurrentUser';

import VideoBottomStatus from '../BottomStatus/VideoBottomStatus';
import inlineStyles from './styles';

import utilities from '../../services/Utilities';
import ReplyIcon from '../CommonComponents/ReplyIcon';
import PepoTxBtn from '../PepoTransactionButton/PepoTxBtn';
import VideoSupporterStat from '../CommonComponents/VideoSupporterStat/VideoSupporterStat';
import DataContract from '../../constants/DataContract';
import InvertedReplyList from "../CommonComponents/InvertedReplyThumbnailList";

class UserVideoHistoryRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      yCoordinateOfReportButton : 0
    };
  }

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

  render() {
    return (
      <View style={[inlineStyles.fullScreen, {position: 'relative'} ]}>
        <FanVideo
          shouldPlay={this.props.shouldPlay}
          userId={this.props.userId}
          videoId={this.props.videoId}
          doRender={this.props.doRender}
          isActive={this.props.isActive}
        />

        <View style={inlineStyles.listContainer} >
            <View style={{ minWidth: '20%', alignSelf: 'flex-start' }}>
              <InvertedReplyList videoId={this.props.videoId} userId={this.props.userId}/>
            </View>
        </View>

        {!!this.props.videoId && !!this.props.userId && (
          <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>

            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>

              <View style={{   left: 10, zIndex: 9, minWidth: '20%', alignSelf: 'flex-start', bottom:60 }}>
                <InvertedReplyList  videoId={this.videoId}
                                    userId={this.userId}
                                    doRender={this.props.doRender}
                                    availableHeight={this.state.yCoordinateOfReportButton}/>
              </View>


            <View style={inlineStyles.touchablesBtns}>

              <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                <PepoTxBtn
                  resyncDataDelegate={this.refetchVideo}
                  userId={this.props.userId}
                  entityId={this.props.videoId}
                />
                <ReplyIcon videoId={this.props.videoId} userId={this.props.userId}/>
                <ShareIcon  userId={this.props.userId} videoId={this.props.videoId} url={DataContract.share.getVideoShareApi(this.videoId)} />
                <View ref={(ref)=> {this.reportViewRef = ref }} onLayout={()=>{}} >
                <ReportVideo  userId={this.props.userId} reportEntityId={this.props.videoId} reportKind={'video'} />
                </View>
              </View>

              <VideoSupporterStat
                entityId={this.props.videoId}
                userId={this.props.userId}
              />
            </View>
            </View>

              <VideoBottomStatus
                userId={this.props.userId}
                entityId={this.props.videoId}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default withNavigation(UserVideoHistoryRow);
