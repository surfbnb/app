import React, { PureComponent } from 'react';
import { View , Dimensions} from 'react-native';
import { withNavigation } from 'react-navigation';
import FanVideo from '../VideoWrapper/FanVideo';
import ReportVideo from "../CommonComponents/ReportVideo";
import PepoApi from '../../services/PepoApi';
import deepGet from 'lodash/get';

import VideoBottomStatus from '../BottomStatus/VideoBottomStatus';
import inlineStyles from './styles';

import ReplyIcon from '../CommonComponents/ReplyIcon';
import PepoTxBtn from '../PepoTransactionButton/PepoTxBtn';
//import VideoSupporterStat from '../CommonComponents/VideoSupporterStat/VideoSupporterStat';
import DataContract from '../../constants/DataContract';
import BottomReplyBar from '../CommonComponents/BottomReplyBar';
import assignIn from 'lodash/assignIn';


import AppConfig from "../../constants/AppConfig";
import CommonStyle from "../../theme/styles/Common";
import BubbleList from "../CommonComponents/BubbleList";
import VideoShareIcon from '../CommonComponents/ShareIcon/VideoShare';
import MaskedChannelHList from "../CommonComponents/MaskedChannelHList";


const AREA = AppConfig.MaxDescriptionArea;
const height = AREA / Dimensions.get('window').width + 20;

class FullScreeVideoRow extends PureComponent {
    constructor(props) {
        super(props);
        this.userId = deepGet(this.props.payload, 'user_id');
        this.videoId = deepGet(this.props.payload, 'video_id');
    }

    refetchVideo = () => {
        new PepoApi(`/videos/${this.videoId}`)
            .get()
            .then((res) => {})
            .catch((error) => {});
    };

    getPixelDropData = () => {
        const parentData =  this.props.getPixelDropData();
        const pixelParams = { e_entity: DataContract.knownEntityTypes.video ,
                             video_id : this.videoId,
                             position: this.props.index
                            };
        return assignIn({}, pixelParams, parentData);
    }

    render() {
        return (
          <View style={[CommonStyle.fullScreen, {position: 'relative'}]}>

                <View style={CommonStyle.videoWrapperfullScreen}>

                        <FanVideo
                            shouldPlay={this.props.shouldPlay}
                            userId={this.userId}
                            videoId={this.videoId}
                            doRender={this.props.doRender}
                            isActive={this.props.isActive}
                            getPixelDropData={this.getPixelDropData}
                        />

                        {!!this.videoId && !!this.userId && (
                            <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
                                <View style={[inlineStyles.touchablesBtns, {justifyContent: 'flex-end'}]} pointerEvents={'box-none'}>

                                  <View style={inlineStyles.invertedList}>
                                    <BubbleList videoId={this.videoId} doRender={this.props.doRender} />
                                    <MaskedChannelHList videoId={this.videoId} />
                                  </View>


                                  <View style={{ minWidth: '20%' }}>
                                    <View style={{alignItems: 'center', alignSelf: 'flex-end', marginRight: 10}}>
                                        <PepoTxBtn
                                            resyncDataDelegate={this.refetchVideo}
                                            userId={this.userId}
                                            entityId={this.videoId}
                                            getPixelDropData={this.getPixelDropData}
                                        />
                                        <ReplyIcon videoId={this.videoId} userId={this.userId}/>
                                        <VideoShareIcon  entityId={this.videoId} url={DataContract.share.getVideoShareApi(this.videoId)}/>
                                    </View>
                                  </View>
                                </View>

                                <VideoBottomStatus
                                    userId={this.userId}
                                    entityId={this.videoId}
                                    getPixelDropData={() => {p_type: 'feed'}}
                                />
                            </View>
                        )}
                    </View>
                <BottomReplyBar userId={this.userId}  videoId={this.videoId}/>
            </View>
        );
    }
}

FullScreeVideoRow.defaultProps = {
    getPixelDropData: function(){
      console.warn("getPixelDropData props is mandatory for Video component");
      return {};
    },
    index:0
  };


export default withNavigation(FullScreeVideoRow);
