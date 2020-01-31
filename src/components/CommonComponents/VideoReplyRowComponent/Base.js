import React, { PureComponent } from 'react';
import { View, TouchableOpacity} from 'react-native';
import FanVideo from "../../VideoWrapper/FanVideo";
import ReportVideo from "../ReportVideo";
import BottomReplyBar from "../BottomReplyBar";
import PepoApi from '../../../services/PepoApi';
import deepGet from 'lodash/get';

import inlineStyles from '../../FullScreenReplyCollection/styles';

import ReplyPepoTxBtn from '../../PepoTransactionButton/ReplyPepoTxBtn';

import ReplyVideoBottomStatus from '../../BottomStatus/ReplyVideoBottomStatus';
import DataContract from '../../../constants/DataContract';
import ReduxGetters from '../../../services/ReduxGetters';
import CommonStyle from "../../../theme/styles/Common";
import assignIn from 'lodash/assignIn';
import InvertedReplyList from "../InvertedReplyThumbnailList";

import AppConfig from "../../../constants/AppConfig";
import ProfilePicture from "../../ProfilePicture";
import multipleClickHandler from '../../../services/MultipleClickHandler';
import { fetchVideo } from '../../../helpers/helpers';
import ReplyShareIcon from '../ShareIcon/ReplyShare';
import Utilities from "../../../services/Utilities";

class Base extends PureComponent {
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
    const video_details = deepGet(res, `data.${DataContract.videos.videoDetailsKey}`),
    item = video_details[this.state.parentVideoId];
    if( item ){
      this.setState({
        parentUserId: item[DataContract.videos.creatorUserIdKey]
      })
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
        const pixelParams = {
            e_entity: 'reply',
            parent_video_id : this.state.parentVideoId,
            p_name: this.state.parentVideoId,
            reply_detail_id :this.props.replyDetailId,
            position: this.props.index
        };
        return assignIn({}, pixelParams, parentData);
    }

    defaultParentClickHandler(){
      this.props.navigation.goBack(null);
    }

    _renderInvertedFlatList = () => {
      if( this.state.parentVideoId ){
        return (
          <View style={[inlineStyles.invertedList, { top: Utilities.getPendantTop() , height: Utilities.getPendantAvailableHeight()}]}>
              <InvertedReplyList  videoId={this.state.parentVideoId}
                                  doRender={this.props.doRender}
                                  paginationService={this.props.paginationService}
                                  onChildClickDelegate={this.props.onChildClickDelegate}
                                  bottomRounding={50}
                                  isActive={this.props.isActive}
                                  isActiveEntity={this.props.isActiveEntity}
                                  fullVideoReplyId={this.props.replyDetailId}
              />
          </View>
        )
      }
      return null;
    }

    render() {
        const videoId = ReduxGetters.getReplyEntityId(this.props.replyDetailId);
        return (
            <View style={[CommonStyle.fullScreen, {position: 'relative'}]}>
              {this._renderInvertedFlatList()}
              <View style={CommonStyle.videoWrapperfullScreen}>

                <FanVideo
                        shouldPlay={this.props.shouldPlay}
                        userId={this.props.userId}
                        videoId={videoId}
                        doRender={this.props.doRender}
                        isActive={this.props.isActive}
                        getPixelDropData={this.getPixelDropData}
                        onMinimumVideoViewed={this.onMinimumVideoViewed}
                    />

                    {!!videoId && !!this.props.userId && (
                        <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>

                            <View style={inlineStyles.touchablesBtns} pointerEvents={'box-none'}>

                              <View style={{ minWidth: '20%' , marginLeft: "auto"}} pointerEvents={'box-none'}>
                                <View style={{alignItems: 'center', alignSelf: 'flex-end', marginRight: 10}} pointerEvents={'box-none'}>
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
                                    <ReplyShareIcon  entityId={this.props.replyDetailId} url={DataContract.share.getVideoReplyShareApi(this.props.replyDetailId)}/>
                                 </View>
                              </View>
                            </View>

                            <ReplyVideoBottomStatus
                                userId={this.props.userId}
                                entityId={this.props.replyDetailId} />
                        </View>

                    )}

                </View>

                <BottomReplyBar  userId={this.state.parentUserId}  videoId={this.state.parentVideoId} />
            </View>
        );
    }
}

Base.defaultProps = {
    getPixelDropData: function(){
      console.warn("getPixelDropData props is mandatory for Video component");
      return {};
    },
    paginationService : null,
    index:0
  };

export default Base
