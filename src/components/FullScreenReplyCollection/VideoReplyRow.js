import React, { PureComponent } from 'react';
import { View , Dimensions, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';
import FanVideo from "../VideoWrapper/FanVideo";
import ShareIcon from "../CommonComponents/ShareIcon";
import ReportVideo from "../CommonComponents/ReportVideo";
import BottomReplyBar from "../CommonComponents/BottomReplyBar";
import PepoApi from '../../services/PepoApi';
import deepGet from 'lodash/get';

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
import multipleClickHandler from '../../services/MultipleClickHandler';


const marginTopForParentIcon = 15;
const AREA = AppConfig.MaxDescriptionArea;
const height = AREA / Dimensions.get('window').width + 20;
import { fetchVideo } from '../../helpers/helpers';

class VideoReplyRow extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        parentVideoId : ReduxGetters.getReplyParentVideoId( props.replyDetailId ),
        parentUserId  : ReduxGetters.getReplyParentUserId( props.replyDetailId )
      }
      this.onParentClickDelegate = this.props.parentClickHandler || this.defaultParentClickHandler;
    }

   componentDidMount(){
     if(this.props.doRender && this.state.parentVideoId && !this.state.parentUserId ){
       this.fetchParentVideo = fetchVideo(this.state.parentVideoId, this.onParentVideoFetch , null , this.onParentVideoFetchComplete);
     }
   } 

   componentDidUpdate(prevProps){
    if(!this.fetchParentVideo && this.props.doRender && this.props.doRender !== prevProps.doRender  && !this.state.parentUserId ){
      fetchVideo(this.state.parentVideoId, this.onParentVideoFetch ,  null , this.onParentVideoFetchComplete);
    }
   }

   componentWillUnmount(){
     this.onParentVideoFetch = () => {};
     this.onParentVideoFetchComplete = () => {};
   }

   onParentProfileIconClick() {
     if(this.state.parentVideoId){
      this.onParentClickDelegate();
     }
   }
   
   onParentVideoFetchComplete() {
     this.fetchParentVideo =  null;
   }

   onParentVideoFetch = (res) => {
    const users = deepGet(res , "data.users") || {} ,
    userKeys =  Object.keys(users) || [] ,
    userId = userKeys[0] || null;
    if(userId){
      this.setState({
        parentUserId: userId
      });
    } 
   }

  refetchVideoReply = () => {
        new PepoApi(`/replies/${this.props.replyDetailId}`)
            .get()
            .then((res) => {})
            .catch((error) => {});
    };

    getPixelDropData = () => {
        const parentData =  this.props.getPixelDropData();
        const pixelParams = { e_entity: 'reply' , parent_video_id : this.state.parentVideoId ,  reply_detail_id :this.props.replyDetailId  };
        return assignIn({}, pixelParams, parentData);
    }

    defaultParentClickHandler(){
      this.props.navigation.goBack(null);
    }

    render() {
        const videoId = ReduxGetters.getReplyEntityId(this.props.replyDetailId);
        return (
            <View style={[CommonStyle.fullScreen, {position: 'relative'}]}>

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

                            <View style={inlineStyles.touchablesBtns} pointerEvents={'box-none'}>

                              {this.state.parentVideoId && (
                                <View style={inlineStyles.invertedList} pointerEvents={'box-none'}>
                                  <InvertedReplyList  videoId={this.state.parentVideoId}
                                                      doRender={this.props.doRender}
                                                      paginationService={this.props.paginationService}
                                                      onChildClickDelegate={this.props.onChildClickDelegate}
                                                      currentIndex={this.props.currentIndex}
                                                      isActiveEntity={this.props.isActiveEntity}
                                                      fullVideoReplyId={this.props.replyDetailId}
                                  />

                                </View>
                              )}

                              <View style={{ minWidth: '20%' }}>
                                <View style={{alignItems: 'center', alignSelf: 'flex-end', marginRight: 10}}>
                                    <ReplyPepoTxBtn
                                        resyncDataDelegate={this.refetchVideoReply}
                                        userId={this.props.userId}
                                        entityId={this.props.replyDetailId}
                                        getPixelDropData={this.getPixelDropData}
                                    />
                                    <TouchableOpacity onPress={multipleClickHandler(()=>{this.onParentProfileIconClick()})}>
                                      <ProfilePicture userId={this.state.parentUserId} style={{height: AppConfig.thumbnailListConstants.parentIconHeight,
                                        width: AppConfig.thumbnailListConstants.parentIconWidth,
                                        borderRadius: AppConfig.thumbnailListConstants.parentIconWidth /2,
                                        marginVertical: 12,
                                        borderColor: 'white',
                                        borderWidth: 1
                                      }}
                                      />
                                    </TouchableOpacity>
                                    <ShareIcon  userId={this.props.userId} url={DataContract.share.getVideoReplyShareApi(this.props.replyDetailId)}
                                                isDisabled={() => {return false}}
                                                 />
                                    <ReportVideo  userId={this.props.userId} reportEntityId={this.props.replyDetailId} reportKind={'reply'} />
                                 </View>

                                <VideoReplySupporterStat
                                    entityId={this.props.replyDetailId}
                                    userId={this.props.userId}
                                />
                              </View>
                            </View>

                            <ReplyVideoBottomStatus
                                userId={this.props.userId}
                                entityId={this.props.replyDetailId}
                            />
                        </View>
                        
                    )}

                </View>

                <BottomReplyBar  userId={this.state.parentUserId}  videoId={this.state.parentVideoId} />
            </View>
        );
    }
}

VideoReplyRow.defaultProps = {
    getPixelDropData: function(){
      console.warn("getPixelDropData props is mandatory for Video component");
      return {};
    },
    paginationService : null,
    currentIndex: 0
  };

export default withNavigation(VideoReplyRow)
