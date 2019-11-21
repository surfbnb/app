import React, { Component } from 'react';
import VideoRecorder from '../VideoRecorder';
import { View } from 'react-native';
import PreviewRecordedVideo from '../PreviewRecordedVideo';
import KeepAwake from 'react-native-keep-awake';

import Store from "../../store";
import {upsertRecordedVideo} from "../../actions";
import utilities from '../../services/Utilities';
import CurrentUser from '../../models/CurrentUser';
import AppConfig from '../../constants/AppConfig';


class CaptureVideo extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    let videoReplyCount = props.navigation.getParam("videoReplyCount");
    this.state = {
      recordingScreen: true,
      videoUri: '',
      actionSheetOnRecordVideo: true,
      modalVisible: true,
      acceptedCameraTnC: null,
      hasVideoReplies: videoReplyCount && videoReplyCount > 0
    };
    this.replyReceiverUserId = null;
    this.replyReceiverVideoId = null;
    this.amountToSendWithReply = null;
    this.videoType = null;
    this.proceedWithExisting = null;
    this.setReplyVideoParams();
    this.showCoachForVideoRecord();

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

    } else {
      // Do nothing.
    }
  }

  isVideoTypePost(){
    return this.videoType === AppConfig.videoTypes.post;
  }

  isVideoTypeReply = () => {
    return this.videoType === AppConfig.videoTypes.reply;
  }

  goToRecordScreen() {
    this.setState({
      recordingScreen: true,
      actionSheetOnRecordVideo: false,
      acceptedCameraTnC: 'true',
      hasVideoReplies: true
    });
  }


  proceedWithExistingVideo = (recordedVideoObj) => {
    this.proceedWithExisting = true;
    this.videoType = recordedVideoObj.video_type || AppConfig.videoTypes.post ;
    this.setState ({
      recordingScreen: false,
      videoUri: recordedVideoObj.raw_video
    });
  };


  saveVideoPrimaryInfo = () => {
   this.proceedWithExisting = false;

   Store.dispatch(upsertRecordedVideo(this.getPrimaryVideoInfo()));
  };


  getPrimaryVideoInfo = () => {
      if (this.proceedWithExisting) return {};

      if (this.isVideoTypeReply()){
        return { video_type: AppConfig.videoTypes.reply , reply_obj: this.getReplyOptions()};
      } else if (this.isVideoTypePost()) {
        return { video_type: AppConfig.videoTypes.post };
      }

  };


  goToDetailsScreen () {
    if (this.videoType ===  AppConfig.videoTypes.post ){
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
      replyOptions['amountToSendWithReply']= this.amountToSendWithReply;
    }
    return replyOptions;
  }

  modalRequestClose = () => {
    if (this.state.recordingScreen) {
      this.props.navigation.goBack();
    } else {
      this.previewVideo.cancleVideoHandling();
    }
  };

  getActionSheetText = (videoObject) => {
    if (videoObject.video_type ===AppConfig.videoTypes.reply ){
      return 'get language from UX';
    } else if (videoObject.video_type === AppConfig.videoTypes.post ) {
      return 'You have already recorded video';
    }
  };

  goToPreviewScreen = (videoUri) => {
    this.setState({
      recordingScreen: false,
      videoUri
    });
  };


  getCurrentView() {
    if (this.state.recordingScreen) {
      return (
        <VideoRecorder
          ref={(recorder) => {
            this.videoRecorder = recorder;
          }}
          acceptedCameraTnC={this.state.acceptedCameraTnC}
          proceedWithExistingVideo={this.proceedWithExistingVideo}
          saveVideoPrimaryInfo={this.saveVideoPrimaryInfo}
          goToPreviewScreen={this.goToPreviewScreen}
          actionSheetOnRecordVideo={this.state.actionSheetOnRecordVideo}
          getActionSheetText={this.getActionSheetText}
          navigation={this.props.navigation}
          isVideoTypeReply={this.isVideoTypeReply()}
          hasVideoReplies={this.state.hasVideoReplies}
          videoId={this.replyReceiverVideoId}

        />
      );
    } else {
      return (
        <PreviewRecordedVideo
          ref={(previewVideo) => {
            this.previewVideo = previewVideo;
          }}
          goToRecordScreen={() => {
            this.goToRecordScreen();
          }}
          goToDetailsScreen={() => {
            this.goToDetailsScreen();
          }}
          saveVideoPrimaryInfo={this.saveVideoPrimaryInfo}
          cachedvideoUrl={this.state.videoUri}
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
