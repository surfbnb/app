import React, { PureComponent } from 'react';
import {View, Dimensions} from 'react-native';
import { withNavigation } from 'react-navigation';

import FanVideo from '../VideoWrapper/FanVideo';
import ShareIcon from "../CommonComponents/ShareIcon";
import PepoApi from '../../services/PepoApi';
import reduxGetter from '../../services/ReduxGetters';
import assignIn from 'lodash/assignIn';

import VideoBottomStatus from '../BottomStatus/VideoBottomStatus';

import inlineStyles from './styles';
import ReportVideo from "../CommonComponents/ReportVideo";
import ReplyIcon from '../CommonComponents/ReplyIcon';
import PepoTxBtn from '../PepoTransactionButton/PepoTxBtn';
import VideoSupporterStat from '../CommonComponents/VideoSupporterStat/VideoSupporterStat';
import DataContract from '../../constants/DataContract';

import InvertedReplyList from '../CommonComponents/InvertedReplyThumbnailList';
import AppConfig from "../../constants/AppConfig";
import BubbleList from "../CommonComponents/BubbleList";

const AREA = AppConfig.MaxDescriptionArea;
const height = AREA / Dimensions.get('window').width + 20;


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

  getPixelDropData = () => {
    const parentData =  this.props.getPixelDropData && this.props.getPixelDropData() || {};
    const pixelParams = {
      e_entity: 'video',
      p_type: 'feed',
      video_id: this.videoId,
    };
    return assignIn({}, pixelParams, parentData);
  }


  render() {
    return (
      <View style={[inlineStyles.fullScreen,  {position: "relative"} ]}>

        <FanVideo
          shouldPlay={this.props.shouldPlay}
          userId={this.userId}
          videoId={this.videoId}
          doRender={this.props.doRender}
          isActive={this.props.isActive}
          getPixelDropData={this.getPixelDropData}
        />
        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>

          <View style={[inlineStyles.touchablesBtns, {justifyContent: 'flex-end'}]} pointerEvents={'box-none'}>

            {/* <View style={inlineStyles.invertedList} pointerEvents={'box-none'}>
              <BubbleList  videoId={this.videoId}   doRender={this.props.doRender} />
            </View> */}

            <View style={{ minWidth: '20%' }}>
              <View style={{alignItems: 'center', alignSelf: 'flex-end', marginRight: 10}}>
                <PepoTxBtn
                  resyncDataDelegate={this.refetchFeed}
                  userId={this.userId}
                  entityId={this.videoId}
                  getPixelDropData={this.getPixelDropData}
                />
                <ReplyIcon videoId={this.videoId} userId={this.userId}/>

                <ShareIcon  userId={this.userId} url={DataContract.share.getVideoShareApi(this.videoId)}/>
                <ReportVideo  userId={this.userId} reportEntityId={this.videoId} reportKind={'video'} />
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
