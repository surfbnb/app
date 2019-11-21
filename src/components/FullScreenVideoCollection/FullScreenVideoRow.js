import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image , Dimensions} from 'react-native';
import { withNavigation } from 'react-navigation';
import FanVideo from '../VideoWrapper/FanVideo';
import ShareIcon from "../CommonComponents/ShareIcon";
import ReportVideo from "../CommonComponents/ReportVideo";
import PepoApi from '../../services/PepoApi';
import deepGet from 'lodash/get';

import VideoBottomStatus from '../BottomStatus/VideoBottomStatus';
import inlineStyles from './styles';

import ReplyIcon from '../CommonComponents/ReplyIcon';
import PepoTxBtn from '../PepoTransactionButton/PepoTxBtn';
import VideoSupporterStat from '../CommonComponents/VideoSupporterStat/VideoSupporterStat';
import DataContract from '../../constants/DataContract';
import BottomReplyBar from '../CommonComponents/BottomReplyBar';
import assignIn from 'lodash/assignIn';


import AppConfig from "../../constants/AppConfig";
import CommonStyle from "../../theme/styles/Common";
import InvertedReplyList from "../CommonComponents/InvertedReplyThumbnailList";


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
        const pixelParams = { e_entity: 'video' , video_id : this.videoId};
        return assignIn({}, pixelParams, parentData);
    } 

    render() {
        return (
          <View style={[CommonStyle.fullScreen, {position: 'relative'}]}>

                <View style={CommonStyle.videoWrapperfullScreen}>

                      <View style={{position: "absolute" , left: 10 , bottom : height, zIndex: 9 }}>
                        <InvertedReplyList  videoId={this.videoId}
                                            userId={this.userId}
                                            listKey={`${this.props.listKey}-InvertedReplyList`}
                                           />
                      </View>

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
                                <View style={inlineStyles.touchablesBtns}>

                                    <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                                        <PepoTxBtn
                                            resyncDataDelegate={this.refetchVideo}
                                            userId={this.userId}
                                            entityId={this.videoId}
                                            getPixelDropData={this.getPixelDropData}
                                        />
                                        <ReplyIcon videoId={this.videoId} userId={this.userId}/>
                                        <ShareIcon  userId={this.userId} videoId={this.videoId} url={DataContract.share.getVideoShareApi(this.videoId)}/>
                                        <ReportVideo  userId={this.userId} reportEntityId={this.videoId} reportKind={'video'} />
                                    </View>

                                    <VideoSupporterStat
                                        entityId={this.videoId}
                                        userId={this.userId}
                                    />
                                </View>

                                <VideoBottomStatus
                                    userId={this.userId}
                                    entityId={this.videoId}
                                    getPixelDropData={() => {p_type: 'feed'}}
                                />
                            </View>
                        )}
                    </View>
                <BottomReplyBar   userId={this.userId}  videoId={this.videoId}/>
            </View>
        );
    }
}

FullScreeVideoRow.defaultProps = {
    getPixelDropData: function(){
      console.warn("getPixelDropData props is mandatory for Video component");
      return {};
    }
  };
  

export default withNavigation(FullScreeVideoRow);
