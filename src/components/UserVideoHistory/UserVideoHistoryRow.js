import React, { PureComponent } from 'react';
import { View, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import FanVideo from '../VideoWrapper/FanVideo';
import ReportVideo from "../CommonComponents/ReportVideo";
import PepoApi from '../../services/PepoApi';

import VideoBottomStatus from '../BottomStatus/VideoBottomStatus';
import inlineStyles from './styles';

import Utilities from '../../services/Utilities';
import ReplyIcon from '../CommonComponents/ReplyIcon';
import PepoTxBtn from '../PepoTransactionButton/PepoTxBtn';
import VideoSupporterStat from '../CommonComponents/VideoSupporterStat/VideoSupporterStat';
import DataContract from '../../constants/DataContract';
import BottomReplyBar from '../CommonComponents/BottomReplyBar';
import CommonStyle from "../../theme/styles/Common";
import assignIn from 'lodash/assignIn';
import InvertedReplyList from "../CommonComponents/InvertedReplyThumbnailList";
import AppConfig from "../../constants/AppConfig";
import BubbleList from '../CommonComponents/BubbleList';
import VideoShareIcon from '../CommonComponents/ShareIcon/VideoShare';


const AREA = AppConfig.MaxDescriptionArea;
const height = AREA / Dimensions.get('window').width + 20;

class UserVideoHistoryRow extends PureComponent {
  constructor(props) {
    super(props);
    this.isUserNavigate = false;
    this.pageType = "user_profile";
    this.pageInit();
  }

  pageInit = () => {
    if( Utilities.getLastChildRoutename(this.props.navigation.state) === 'VideoPlayer'){
      this.isUserNavigate = true;
      return this.pageType = 'video_player';
    }
  }

  getPixelDropData = () => {
    const parentData =  this.props.getPixelDropData() ;
    const pixelParams = {
      e_entity: 'video',
      video_id: this.props.videoId,
    };
    return assignIn({}, pixelParams, parentData);
  }


  refetchVideo = () => {
    new PepoApi(`/videos/${this.props.videoId}`)
      .get()
      .then((res) => {})
      .catch((error) => {});
  };

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
                      getPixelDropData={this.getPixelDropData}
                    />

                    {!!this.props.videoId && !!this.props.userId && (
                      <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>

                        <View style={[inlineStyles.touchablesBtns ]} pointerEvents={'box-none'} >

                          <View style={inlineStyles.invertedList}>
                            <BubbleList videoId={this.props.videoId} doRender={this.props.doRender} />
                          </View>



                          <View style={{ minWidth: '20%' }}>
                            <View style={{alignItems: 'center', alignSelf: 'flex-end', marginRight: 10}}>
                            <PepoTxBtn
                              resyncDataDelegate={this.refetchVideo}
                              userId={this.props.userId}
                              entityId={this.props.videoId}
                              getPixelDropData={this.getPixelDropData}
                            />
                            <ReplyIcon videoId={this.props.videoId} userId={this.props.userId}/>
                            <VideoShareIcon entityId={this.props.videoId} url={DataContract.share.getVideoShareApi(this.props.videoId)} />
                            <ReportVideo  userId={this.props.userId} reportEntityId={this.props.videoId} reportKind={'video'} />
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
                          isUserNavigate={this.isUserNavigate}
                        />
                      </View>
                    )}
                  </View>

            <BottomReplyBar  userId={this.props.userId}  videoId={this.props.videoId}/>
      </View>
    );
  }
}

UserVideoHistoryRow.defaultProps = {
  getPixelDropData: function(){
    console.warn("getPixelDropData props is mandatory for UserVideoHistoryRow component");
    return {};
  }
};

export default withNavigation(UserVideoHistoryRow);
