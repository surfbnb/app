import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import FanVideo from "../VideoWrapper/FanVideo";
import ShareIcon from "../CommonComponents/ShareIcon";
import ReportVideo from "../CommonComponents/ReportVideo";
import PepoApi from '../../services/PepoApi';

import inlineStyles from './styles';

import ReplyPepoTxBtn from '../PepoTransactionButton/ReplyPepoTxBtn';
import VideoReplySupporterStat from '../CommonComponents/VideoSupporterStat/VideoReplySupporterStat';

import ReplyVideoBottomStatus from '../BottomStatus/ReplyVideoBottomStatus';
import DataContract from '../../constants/DataContract';
import ReduxGetters from '../../services/ReduxGetters';
import InvertedReplyList from "../CommonComponents/InvertedReplyThumbnailList";

class VideoReplyRow extends PureComponent {
    constructor(props) {
        super(props);
    }

    refetchVideoReply = () => {
        new PepoApi(`/replies/${this.props.replyDetailId}`)
            .get()
            .then((res) => {})
            .catch((error) => {});
    };

  //Required from Backend , we need video  stats entity 

    render() {
        let userId = this.props.userId,
            replyDetailId = this.props.replyDetailId,
            videoId = ReduxGetters.getReplyEntityId(replyDetailId),
            parentVideoId = ReduxGetters.getReplyEntity( replyDetailId )[DataContract.replies.parentVideoIdKey];
        return (
            <View style={[inlineStyles.fullScreen, {position: 'relative'} ]}>
                <FanVideo
                    shouldPlay={this.props.shouldPlay}
                    userId={userId}
                    videoId={videoId}
                    doRender={this.props.doRender}
                    isActive={this.props.isActive}
                />

                <View style={inlineStyles.listContainer} >
                    <View style={{ minWidth: '20%', alignSelf: 'flex-start' }}>
                    <InvertedReplyList videoId={parentVideoId} userId={userId} onChildClickDelegate={this.props.onChildClickDelegate}/>
                    </View>
                </View>

                {!!videoId && !!userId && (
                    <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
                        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
                            <View style={inlineStyles.touchablesBtns}>

                                <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                                    <ReplyPepoTxBtn
                                        resyncDataDelegate={this.refetchVideoReply}
                                        userId={userId}
                                        entityId={replyDetailId}
                                    />
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
                    </View>
                )}
            </View>
        );
    }
}


VideoReplyRow.defaultProps = {
    paginationService : null
}

export default withNavigation(VideoReplyRow);
