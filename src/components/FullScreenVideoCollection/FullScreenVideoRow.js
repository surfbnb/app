import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
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

    render() {
        return (
            <View style={CommonStyle.fullScreen}>
                
                <View style={CommonStyle.videoWrapperfullScreen}>
                        <FanVideo
                            shouldPlay={this.props.shouldPlay}
                            userId={this.userId}
                            videoId={this.videoId}
                            doRender={this.props.doRender}
                            isActive={this.props.isActive}
                        />

                        {!!this.videoId && !!this.userId && (
                            <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
                                <View style={inlineStyles.touchablesBtns}>

                                    <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                                        <PepoTxBtn
                                            resyncDataDelegate={this.refetchVideo}
                                            userId={this.userId}
                                            entityId={this.videoId}
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
                                />
                            </View>
                        )}
                    </View>
                <BottomReplyBar   userId={this.userId}  videoId={this.videoId}/>     
            </View>
        );
    }
}

export default withNavigation(FullScreeVideoRow);
