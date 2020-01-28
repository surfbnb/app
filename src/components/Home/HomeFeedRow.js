import React, { PureComponent } from 'react';
import {View, Text} from 'react-native';
import { withNavigation } from 'react-navigation';
import MaskedView from '@react-native-community/masked-view';

import FanVideo from '../VideoWrapper/FanVideo';
import PepoApi from '../../services/PepoApi';
import reduxGetter from '../../services/ReduxGetters';
import assignIn from 'lodash/assignIn';

import VideoBottomStatus from '../BottomStatus/VideoBottomStatus';

import inlineStyles from './styles';
import ReportVideo from "../CommonComponents/ReportVideo";
import ReplyIcon from '../CommonComponents/ReplyIcon';
import PepoTxBtn from '../PepoTransactionButton/PepoTxBtn';
import DataContract from '../../constants/DataContract';
import VideoShareIcon from '../CommonComponents/ShareIcon/VideoShare';
import BubbleList from "../CommonComponents/BubbleList";
import ChannelNamesFlatlist from '../CommonComponents/ChannelNamesFlatlist';
import LinearGradient from "react-native-linear-gradient";

class MaskedChannelNamesFlatlist extends React.Component {
  render() {
    return (
      <MaskedView
        style={{ flex: 1, flexDirection: 'row', height: '100%' }}
        maskElement={
          <View
            style={{
              // Transparent background because mask is based off alpha channel.
              backgroundColor: 'transparent',
              flex: 1
            }}
          >
            <LinearGradient
              //colors={['rgba(76, 102, 159, 1)', 'rgba(76, 102, 159, 1)', 'rgba(76, 102, 159, 0)']}
              colors={['rgb(255, 85, 102)', 'rgb(203, 86, 151)', 'rgba(252, 115, 153, 0.05)', 'rgba(255, 116, 153, 0)']}
              locations={[0, 0.81, 0.91, 1]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                // paddingLeft: 15,
                // paddingRight: 15,
                // width: '100%'
              }}></LinearGradient>
          </View>
        }
      >
        {/* Shows behind the mask, you can put anything here, such as an image */}

        <ChannelNamesFlatlist />
      </MaskedView>
    );
  }
}


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
      position: this.props.index
    };
    return assignIn({}, pixelParams, parentData);
  }




  render() {
    return (
      <View style={[inlineStyles.fullScreen,  {position: "relative"} ]}>

        <FanVideo
          shouldPlay={this.props.shouldPlay}
          dataChangeEvent={this.props.dataChangeEvent}
          userId={this.userId}
          videoId={this.videoId}
          doRender={this.props.doRender}
          isActive={this.props.isActive}
          getPixelDropData={this.getPixelDropData}
        />
        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>

          <View style={[inlineStyles.touchablesBtns, {justifyContent: 'flex-end'}]} pointerEvents={'box-none'}>

            <View style={inlineStyles.invertedList}>
              <BubbleList videoId={this.videoId} doRender={this.props.doRender} />
              <View style={{marginRight: '20%', marginTop: 20, justifyContent: 'center'}}>
                <MaskedChannelNamesFlatlist />
              </View>
            </View>

            <View style={{ minWidth: '20%'}}>
              <View style={{alignItems: 'center', alignSelf: 'flex-end', marginRight: 10}}>
                <PepoTxBtn
                  resyncDataDelegate={this.refetchFeed}
                  userId={this.userId}
                  entityId={this.videoId}
                  getPixelDropData={this.getPixelDropData}
                />
                <ReplyIcon videoId={this.videoId} userId={this.userId}/>
                <VideoShareIcon  entityId={this.videoId} url={DataContract.share.getVideoShareApi(this.videoId)}/>
                <ReportVideo userId={this.userId} reportEntityId={this.videoId} reportKind={'video'} />
              </View>

              {/*<VideoSupporterStat*/}
                {/*entityId={this.videoId}*/}
                {/*userId={this.userId}*/}
                {/*pageName="feed"*/}
              {/*/>*/}
            </View>

          </View>

          <VideoBottomStatus userId={this.userId} entityId={this.videoId} />
        </View>
      </View>
    );
  }
}

HomeFeedRow.defaultProps = {
  index: 0
};

export default withNavigation(HomeFeedRow);
