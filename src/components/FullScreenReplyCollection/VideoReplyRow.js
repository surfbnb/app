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
import InvertedReplyList from "../CommonComponents/InvertedReplyThumbnailList";

class VideoReplyRow extends PureComponent {
    constructor(props) {
        super(props);
        this.parentVideoId = ReduxGetters.getReplyParentVideoId( this.props.replyDetailId );
        this.parentUserId =  ReduxGetters.getReplyParentUserId( this.props.replyDetailId );
      this.state = {
        yCoordinateOfReportButton : 0
      };
    }


  componentDidMount() {
    setTimeout(()=>{
      this.measureWindow();
    }, 10);
  };


  componentDidUpdate(prevProps) {

    if (prevProps.isActive !== this.props.isActive){
      this.measureWindow();
    }

  };

  measureWindow = () => {
    if (this.props.isActive === true){
      console.log('measureWindow:::isActive true', this.videoId);
      this.reportViewRef.measureInWindow(this.calculateYCoordinateOfReportButton);
    }
  };


  calculateYCoordinateOfReportButton = (ox, oy, width, height) => {
    this.setState({yCoordinateOfReportButton: oy});
    console.log('============== measurePosition ==============' );
    console.log('ox',ox);
    console.log('oy',oy);
    console.log('width',width);
    console.log('height',height);
    console.log('============== measurePosition ==============' );
  };


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
                            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                                <View style={{   left: 10, zIndex: 9, minWidth: '20%', alignSelf: 'flex-start', bottom:60 }}>
                                    <InvertedReplyList  videoId={parentVideoId}
                                                        userId={parentUserId}
                                                        doRender={this.props.doRender}
                                                        availableHeight={this.state.yCoordinateOfReportButton}
                                                        paginationService={this.props.paginationService}
                                                        onChildClickDelegate={this.props.onChildClickDelegate}
                                                        currentIndex={this.props.currentIndex}
                                    />
                                </View>

                            <View style={inlineStyles.touchablesBtns}>

                                <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                                    <ReplyPepoTxBtn
                                        resyncDataDelegate={this.refetchVideoReply}
                                        userId={userId}
                                        entityId={replyDetailId}
                                        getPixelDropData={this.getPixelDropData}
                                    />
                                    <ReplyIcon userId={this.parentUserId}  videoId={this.parentVideoId} />
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
