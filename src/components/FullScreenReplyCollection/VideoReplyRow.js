import React, { PureComponent } from 'react';
import { View , Dimensions} from 'react-native';
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
import InvertedReplyList from "../CommonComponents/InvertedReplyThumbnailList";

import AppConfig from "../../constants/AppConfig";
import ProfilePicture from "../ProfilePicture";


const marginTopForParentIcon = 15;
const AREA = AppConfig.MaxDescriptionArea;
const height = AREA / Dimensions.get('window').width + 20;

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

    getPixelDropData = () => {
        const parentData =  this.props.getPixelDropData();
        const pixelParams = { e_entity: 'reply' , parent_video_id : this.parentVideoId ,  reply_detail_id :this.props.replyDetailId  };
        return assignIn({}, pixelParams, parentData);
    }

    render() {
        let userId = this.props.userId,
            replyDetailId = this.props.replyDetailId,
            videoId = ReduxGetters.getReplyEntityId(replyDetailId),
            parentVideoId = ReduxGetters.getReplyEntity( replyDetailId )[DataContract.replies.parentVideoIdKey],
          parentUserId = ReduxGetters.getReplyEntity(replyDetailId)[DataContract.replies.creatorUserIdKey];
        ;
        return (
            <View style={[CommonStyle.fullScreen, {position: 'relative'}]}>

                <View style={CommonStyle.videoWrapperfullScreen}>

                  <View style={{position: "absolute" , left: 10 , bottom : height, zIndex: 9 }}>
                    <InvertedReplyList  videoId={parentVideoId}
                                        userId={parentUserId}
                                        doRender={this.props.doRender}
                                        paginationService={this.props.paginationService}
                                        onChildClickDelegate={this.props.onChildClickDelegate}
                                        currentIndex={this.props.currentIndex}
                                        // parentIconHeight={AppConfig.thumbnailListConstants.parentIconHeight + marginTopForParentIcon }
                    />

                  </View>

                    <FanVideo
                        shouldPlay={this.props.shouldPlay}
                        userId={userId}
                        videoId={videoId}
                        doRender={this.props.doRender}
                        isActive={this.props.isActive}
                        getPixelDropData={this.getPixelDropData}
                    />

                    {!!videoId && !!userId && (
                        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>

                            <View style={inlineStyles.touchablesBtns}>

                                <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                                    <ReplyPepoTxBtn
                                        resyncDataDelegate={this.refetchVideoReply}
                                        userId={userId}
                                        entityId={replyDetailId}
                                        getPixelDropData={this.getPixelDropData}
                                    />
                                  <ProfilePicture userId={parentUserId} style={{height: AppConfig.thumbnailListConstants.parentIconHeight,
                                    width: AppConfig.thumbnailListConstants.parentIconWidth,
                                    borderRadius: AppConfig.thumbnailListConstants.parentIconWidth /2,
                                    marginVertical: 12
                                  }}
                                  />



                                    {/*<ReplyIcon userId={this.parentUserId}  videoId={this.parentVideoId} />*/}
                                    <ShareIcon  userId={userId} entityId={replyDetailId} url={DataContract.share.getVideoReplyShareApi(replyDetailId)} />
                                    <View ref={(ref)=> {this.reportViewRef = ref }} onLayout={()=>{}} >
                                      <ReportVideo  userId={userId} reportEntityId={this.replyId} reportKind={'reply'} />
                                    </View>
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

VideoReplyRow.defaultProps = {
    getPixelDropData: function(){
      console.warn("getPixelDropData props is mandatory for Video component");
      return {};
    },
    paginationService : null
  };

export default withNavigation(VideoReplyRow);
