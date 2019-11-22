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
import assignIn from 'lodash/assignIn';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        parentVideoId : ReduxGetters.getReplyParentVideoId( ownProps.replyDetailId ,state ),
        parentUserId :  ReduxGetters.getReplyParentUserId(ownProps.replyDetailId , state )
    };
  };

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

    getPixelDropData = () => {
        const parentData =  this.props.getPixelDropData(); 
        const pixelParams = { e_entity: 'reply' , parent_video_id : this.props.parentVideoId ,  reply_detail_id :this.props.replyDetailId  };
        return assignIn({}, pixelParams, parentData);
    } 

    render() {
        const videoId = ReduxGetters.getReplyEntityId(this.props.replyDetailId);
        return (
            <View style={CommonStyle.fullScreen}>
                
                <View style={CommonStyle.videoWrapperfullScreen}>
                    <FanVideo
                        shouldPlay={this.props.shouldPlay}
                        userId={this.props.userId}
                        videoId={videoId}
                        doRender={this.props.doRender}
                        isActive={this.props.isActive}
                        getPixelDropData={this.getPixelDropData}
                    />

                    {!!videoId && !!this.props.userId && (
                        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
                            <View style={inlineStyles.touchablesBtns}>

                                <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                                    <ReplyPepoTxBtn
                                        resyncDataDelegate={this.refetchVideoReply}
                                        userId={this.props.userId}
                                        entityId={this.props.replyDetailId}
                                        getPixelDropData={this.getPixelDropData}
                                    />
                                    <ReplyIcon userId={this.props.parentUserId}  videoId={this.props.parentVideoId} />
                                    <ShareIcon  userId={this.props.userId} entityId={this.props.replyDetailId} url={DataContract.share.getVideoReplyShareApi(this.props.replyDetailId)} />
                                    <ReportVideo  userId={this.props.userId} reportEntityId={this.replyId} reportKind={'reply'} />
                                </View>

                                <VideoReplySupporterStat
                                    entityId={this.props.replyDetailId}
                                    userId={this.props.userId}
                                />
                            </View>

                            <ReplyVideoBottomStatus
                                userId={this.props.userId}
                                entityId={this.props.replyDetailId}
                            />
                        </View>
                    )}

                </View>

                <BottomReplyBar  userId={this.props.parentUserId}  videoId={this.props.parentVideoId} />
            </View>
        );
    }
}

VideoReplyRow.defaultProps = {
    getPixelDropData: function(){
      console.warn("getPixelDropData props is mandatory for Video component");
      return {};
    }
  };

export default connect(mapStateToProps)(withNavigation(VideoReplyRow));
