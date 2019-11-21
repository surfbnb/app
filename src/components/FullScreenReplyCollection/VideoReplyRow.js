import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import FanVideo from "../VideoWrapper/FanVideo";
import ShareIcon from "../CommonComponents/ShareIcon";
import ReportVideo from "../CommonComponents/ReportVideo";
import BottomReplyBar from "../CommonComponents/BottomReplyBar";
import ReplyIcon from "../CommonComponents/ReplyIcon";
import PepoApi from '../../services/PepoApi';

import inlineStyles from './styles';

import ReplyPepoTxBtn from '../PepoTransactionButton/ReplyPepoTxBtn';
import VideoReplySupporterStat from '../CommonComponents/VideoSupporterStat/VideoReplySupporterStat';

import ReplyVideoBottomStatus from '../BottomStatus/ReplyVideoBottomStatus';
import DataContract from '../../constants/DataContract';
import ReduxGetters from '../../services/ReduxGetters';
import CommonStyle from "../../theme/styles/Common";

class VideoReplyRow extends PureComponent {
    constructor(props) {
        super(props);
        this.parentVideoId = ReduxGetters.getReplyParentVideoId( this.props.replyDetailId );
        this.parentUserId =  ReduxGetters.getReplyParentUserId( this.props.replyDetailId );
    }

    refetchVideoReply = () => {
        new PepoApi(`/replies/${this.props.replyDetailId}`)
            .get()
            .then((res) => {})
            .catch((error) => {});
    };

    render() {
        let userId = this.props.userId,
            replyDetailId = this.props.replyDetailId,
            videoId = ReduxGetters.getReplyEntityId(replyDetailId);
        return (
            <View style={CommonStyle.fullScreen}>
                
                <View style={CommonStyle.videoWrapperfullScreen}>
                    <FanVideo
                        shouldPlay={this.props.shouldPlay}
                        userId={userId}
                        videoId={videoId}
                        doRender={this.props.doRender}
                        isActive={this.props.isActive}
                    />

                    {!!videoId && !!userId && (
                        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
                            <View style={inlineStyles.touchablesBtns}>

                                <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                                    <ReplyPepoTxBtn
                                        resyncDataDelegate={this.refetchVideoReply}
                                        userId={userId}
                                        entityId={replyDetailId}
                                    />
                                    <ReplyIcon userId={this.parentUserId}  videoId={this.parentVideoId} />
                                    <ShareIcon  userId={userId} entityId={replyDetailId} url={DataContract.share.getVideoReplyShareApi(replyDetailId)} />
                                    <ReportVideo  userId={userId} reportEntityId={this.replyId} reportKind={'reply'} />
                                </View>

                                <VideoReplySupporterStat
                                    entityId={replyDetailId}
                                    userId={userId}
                                />
                            </View>

                            <ReplyVideoBottomStatus
                                userId={userId}
                                entityId={replyDetailId}
                            />
                        </View>
                    )}

                </View>

                <BottomReplyBar  userId={this.parentUserId}  videoId={this.parentVideoId} />
            </View>
        );
    }
}

export default withNavigation(VideoReplyRow);
