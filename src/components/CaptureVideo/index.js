import React, { Component } from 'react';
import VideoRecorder from '../VideoRecorder';
import { View } from 'react-native';
import PreviewRecordedVideo from '../PreviewRecordedVideo';
import Store from "../../store";
import {upsertRecordedVideo} from "../../actions";
import utilities from '../../services/Utilities';
import CurrentUser from '../../models/CurrentUser';
import AppConfig from '../../constants/AppConfig';
import deepGet from 'lodash/get';
import FanVideoDetails from '../FanVideoDetails';
import KeepAwake from 'react-native-keep-awake';
import reduxGetters from "../../services/ReduxGetters";
import FfmpegProcesser from "../../services/FfmpegProcesser";

class CaptureVideo extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    let isChargeble = props.navigation.getParam("isChargeble");
    this.state = {
      recordingScreen: true,
      videoUri: '',
      actionSheetOnRecordVideo: true,
      modalVisible: true,
      acceptedCameraTnC: null,
      showLightBoxOnReply: isChargeble,
      totalDuration: 0
    };
    this.replyReceiverUserId = null;
    this.replyReceiverVideoId = null;
    this.amountToSendWithReply = null;
    this.videoType = null;
    this.proceedWithExisting = null;
    this.setReplyVideoParams();
    this.showCoachForVideoRecord();
    this.previewVideo = React.createRef();
  }

  componentDidMount () {}


  showCoachForVideoRecord() {
    const oThis = this;
    if (this.isVideoTypePost()) {
      utilities.getItem(`${CurrentUser.getUserId()}-accepted-camera-t-n-c`).then((terms) => {
        oThis.setState({ acceptedCameraTnC: terms });
      });
    }
  }

  setReplyVideoParams(){
    this.videoType = this.props.navigation.getParam("videoType");
    if (this.isVideoTypeReply()){
      this.replyReceiverUserId = this.props.navigation.getParam("userId");
      this.replyReceiverVideoId = this.props.navigation.getParam("videoId");
      this.amountToSendWithReply = this.props.navigation.getParam("amount");
      this.isChargeble = this.props.navigation.getParam("isChargeble");
      this.toTokenHolderAddress = this.props.navigation.getParam("toTokenHolderAddress");

    } else {
      // Do nothing.
      this.channelId = this.props.navigation.getParam("channelId");
    }
  }

  isVideoTypePost(){
    return this.videoType === AppConfig.videoTypes.post;
  }

  isVideoTypeReply = () => {
    return this.videoType === AppConfig.videoTypes.reply;
  };

  goToRecordScreen = () => {
    this.setState({
      recordingScreen: true,
      actionSheetOnRecordVideo: false,
      acceptedCameraTnC: 'true',
      showLightBoxOnReply: false
    });
  }


  proceedWithExistingVideo = (recordedVideoObj) => {
    this.proceedWithExisting = true;
    this.videoType = recordedVideoObj.video_type || AppConfig.videoTypes.post ;
    console.log(recordedVideoObj.video_length, 'totalDurationtotalDurationtotalDuration');
    this.setState ({
      recordingScreen: false,
      videoUrlsList: recordedVideoObj.raw_video_list,
      totalDuration: recordedVideoObj.video_length,
      previewURL: recordedVideoObj.previewURL,

    });
  };


  saveVideoPrimaryInfo = () => {
   this.proceedWithExisting = false;
   console.log('saveVideoPrimaryInfo',this.getPrimaryVideoInfo() );
   Store.dispatch(upsertRecordedVideo(this.getPrimaryVideoInfo()));
  };


  getPrimaryVideoInfo = () => {
      if (this.proceedWithExisting) return {};

      if (this.isVideoTypeReply()){
        return { video_type: AppConfig.videoTypes.reply , reply_obj: this.getReplyOptions()};
      } else if (this.isVideoTypePost()) {

        return { video_type: AppConfig.videoTypes.post, video_desc: this.getVideoDesc() };
      }
  };

  getVideoDesc = () => {
      let desc = '';
      if (this.channelId){
      let tagIds = reduxGetters.getChannelTagIds(this.channelId);

      if (tagIds && tagIds instanceof Array && tagIds.length > 0 ) {
        let tagId = tagIds[0];
        let tagInfo = reduxGetters.getHashTag(tagId);
        desc = `#${tagInfo.text}`

      }
    }
    return desc;
  };


  goToDetailsScreen = () => {
    if (this.videoType ===  AppConfig.videoTypes.post ){
      console.log('----goToDetailsScreen----');
      this.props.navigation.push('FanVideoDetails', this.getPrimaryVideoInfo());
    } else if (this.videoType ===  AppConfig.videoTypes.reply ){
      this.props.navigation.push('FanVideoReplyDetails', this.getPrimaryVideoInfo());
    }
  }

  getReplyOptions(){
    // Reply options are received to View when user click on Record video (Plus icon).
    let replyOptions = {};
    if ( this.isVideoTypeReply()) {
      replyOptions['replyReceiverUserId'] = this.replyReceiverUserId;
      replyOptions['replyReceiverVideoId'] = this.replyReceiverVideoId;
      replyOptions['amountToSendWithReply'] = this.amountToSendWithReply;
      replyOptions['isChargeble'] = this.isChargeble;
      replyOptions['toTokenHolderAddress'] = this.toTokenHolderAddress;
    }
    return replyOptions;
  }

  getName(){
    return reduxGetters.getUserName(deepGet (reduxGetters.getRecordedVideo(),'reply_obj.replyReceiverUserId'));
  }

  getActionSheetText = (videoObject) => {
    if (videoObject.video_type ===AppConfig.videoTypes.reply ){
      return 'You have a pre-recorded reply';
    } else if (videoObject.video_type === AppConfig.videoTypes.post ) {
      return 'You have already recorded video';
    }
  };

  goToPreviewStateUpdate( videoUrlsList, totalDuration , previewURL ="" , recordingScreen = false  ){
    this.setState({
      recordingScreen,
      videoUrlsList,
      totalDuration,
      previewURL
    });
  }

  goToPreviewScreen = (videoUrlsList, totalDuration) => {
    if( videoUrlsList.length == 1){
      this.goToPreviewStateUpdate(videoUrlsList , totalDuration , videoUrlsList[0].uri );
      return;
    } else if(utilities.isAndroid()) {
      this.goToPreviewStateUpdate(videoUrlsList , totalDuration  );
      return;
    }

    FfmpegProcesser.init(videoUrlsList.map((obj) =>obj.uri));
    FfmpegProcesser.localConcat()
      .then((previewURL) => {
        this.goToPreviewStateUpdate(videoUrlsList , totalDuration ,previewURL  );
      }).catch(()=>{
      this.goToPreviewStateUpdate(videoUrlsList , totalDuration );
    }) ;
  };


  getCurrentView() {
    if (this.state.recordingScreen) {
      return (
        <VideoRecorder
          acceptedCameraTnC={this.state.acceptedCameraTnC}
          proceedWithExistingVideo={this.proceedWithExistingVideo}
          saveVideoPrimaryInfo={this.saveVideoPrimaryInfo}
          goToPreviewScreen={this.goToPreviewScreen}
          actionSheetOnRecordVideo={this.state.actionSheetOnRecordVideo}
          getActionSheetText={this.getActionSheetText}
          navigation={this.props.navigation}
          isVideoTypeReply={this.isVideoTypeReply()}
          showLightBoxOnReply={this.state.showLightBoxOnReply}
          videoId={this.replyReceiverVideoId}

        />
      );
    } else {
      return (
        <PreviewRecordedVideo
          ref={this.previewVideo}
          goToRecordScreen={this.goToRecordScreen}
          goToDetailsScreen={this.goToDetailsScreen}
          saveVideoPrimaryInfo={this.saveVideoPrimaryInfo}
          videoUrlsList={this.state.videoUrlsList}
          totalDuration={this.state.totalDuration}
          previewURL={this.state.previewURL}
          navigation={this.props.navigation}
        />
      );
    }
  }

  render() {
    return <View style={{flex:1 }}>
      <KeepAwake />
      {this.getCurrentView()}
    </View>
  }
}

//make this component available to the app
export default CaptureVideo;
