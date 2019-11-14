import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import FanVideo from "../VideoWrapper/FanVideo";
import ShareIcon from "../CommonComponents/ShareIcon";
import ReportVideo from "../CommonComponents/ReportVideo";
import PepoApi from '../../services/PepoApi';
import deepGet from 'lodash/get';

import inlineStyles from './styles';

import ReplyPepoTxBtn from '../PepoTransactionButton/ReplyPepoTxBtn';
import VideoReplySupporterStat from '../CommonComponents/VideoSupporterStat/VideoReplySupporterStat';

import ReplyVideoBottomStatus from '../BottomStatus/ReplyVideoBottomStatus';
import DataContract from '../../constants/DataContract';
import ReduxGetters from '../../services/ReduxGetters';



class VideoReplyRow extends PureComponent {
    constructor(props) {
        super(props);
        this.userId = deepGet(this.props.item, 'payload.user_id');
        this.replyDetailId = deepGet(this.props.item,`payload.${DataContract.replies.replyDetailIdKey}`);
        this.videoId = ReduxGetters.getReplyEntityId(this.replyDetailId);
    }

    refetchVideoReply = () => {
        new PepoApi(`/replies/${this.replyDetailId}`)
            .get()
            .then((res) => {})
            .catch((error) => {});
    };

  //Required from Backend , we need video  stats entity 

    render() {
        return (
            <View style={inlineStyles.fullScreen}>
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
                                <ReplyPepoTxBtn
                                    resyncDataDelegate={this.refetchVideoReply}
                                    userId={this.userId}
                                    entityId={this.replyDetailId}
                                />
                                <ShareIcon  userId={this.userId} entityId={this.replyDetailId} url={DataContract.share.getVideoReplyShareApi(this.replyDetailId)}/>
                                <ReportVideo  userId={this.userId} entityId={this.replyDetailId}/>
                            </View>

                            <VideoReplySupporterStat
                                entityId={this.replyDetailId}
                            />
                        </View>

                        <ReplyVideoBottomStatus
                            userId={this.userId}
                            entityId={this.replyDetailId}
                        />
                    </View>
                )}
            </View>
        );
    }
}

export default withNavigation(VideoReplyRow);
