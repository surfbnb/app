import React, { PureComponent } from 'react';
import {View} from 'react-native';
import { withNavigation } from 'react-navigation';


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
import MaskedChannelHList from '../CommonComponents/MaskedChannelHList';


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
    new PepoApi(DataContract.feed.getSingleFeedApi(this.props.feedId))
      .get()
      .then((res) => {})
      .catch((error) => {});
  };

  getPixelDropData = () => {
    const parentData =  this.props.getPixelDropData && this.props.getPixelDropData() || {};
    const pixelParams = {
      e_entity: DataContract.knownEntityTypes.video,
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
              <MaskedChannelHList videoId={this.videoId} />
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
              </View>
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
