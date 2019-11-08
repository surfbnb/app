import React, { Component } from 'react';
import VideoRecorder from '../VideoRecorder';
import PreviewRecordedVideo from '../PreviewRecordedVideo';
import FanVideoDetails from '../FanVideoDetails';
import Store from "../../store";
import {upsertRecordedVideo} from "../../actions";
import utilities from '../../services/Utilities';
import CurrentUser from '../../models/CurrentUser';


const VideoTypesConfig = {
  'post' : {
    'type': 'post'
  },
  'reply': {
    'type': 'reply'
  }
};

class CaptureVideo extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      recordingScreen: true,
      videoUri: '',
      actionSheetOnRecordVideo: true,
      modalVisible: true,
      acceptedCameraTnC: null,
      showReplyCoachScreen: false
    };
    this.isVideoTypeReply = null;
    this.replyReceiverUserId = null;
    this.replyReceiverVideoId = null;
    this.amountToSendWithReply = null;
    this.videoType = null;

    this.setReplyVideoParams();

  }

  componentDidMount () {

    if (! this.isVideoTypeReply) {
        utilities.getItem(`${CurrentUser.getUserId()}-accepted-camera-t-n-c`).then((terms) => {
          this.setState({ acceptedCameraTnC: terms });
        });
    }

  }

  setReplyVideoParams(){
    this.isVideoTypeReply = this.props.navigation.getParam("videoTypeReply");
    if (this.isVideoTypeReply){
      this.replyReceiverUserId = this.props.navigation.getParam("replyReceiverUserId");
      this.replyReceiverVideoId = this.props.navigation.getParam("replyReceiverVideoId");
      this.amountToSendWithReply = this.props.navigation.getParam("amountToSendWithReply");
      this.setState({showReplyCoachScreen: this.props.navigation.getParam("showReplyCoachScreen")});
    } else {
      // Do nothing.
    }
  }

  goToRecordScreen() {
    this.setState({
      recordingScreen: true,
      actionSheetOnRecordVideo: false,
      acceptedCameraTnC: 'true'
    });
  }


  proceedWithExistingVideo(recordedVideoObj) {
    this.videoType = recordedVideoObj.video_type || VideoTypesConfig.post.type;
    this.setState ({
      recordingScreen: false,
      videoUri: recordedVideoObj.raw_video
    });
  }

  saveVideoPrimaryInfo = () => {
    if (this.isVideoTypeReply) {
      this.videoType =  VideoTypesConfig.reply.type;
      Store.dispatch(upsertRecordedVideo({ video_type: VideoTypesConfig.reply.type, reply_obj: this.getReplyOptions()}));
    } else {
      this.videoType =  VideoTypesConfig.post.type;
      Store.dispatch(upsertRecordedVideo({ video_type: VideoTypesConfig.post.type  }));
    }
  };


  goToDetailsScreen() {
    if (this.videoType ===  VideoTypesConfig.post.type){
      this.props.navigation.push('FanVideoDetails');
    } else if (this.videoType ===  VideoTypesConfig.reply.type){
      this.props.navigation.push('FanVideoReplyDetails');
    }
  }

  getReplyOptions(){
    // Reply options are received to View when user click on Record video (Plus icon).
    let replyOptions = {};
    if ( this.isVideoTypeReply ) {
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
    if (videoObject.video_type === VideoTypesConfig.reply.type){
      return 'get language from UX';
    } else if (videoObject.video_type === VideoTypesConfig.post.type) {
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
          isVideoTypeReply={this.isVideoTypeReply}

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
          cachedvideoUrl={this.state.videoUri}
          navigation={this.props.navigation}
        />
      );
    }
  }

  render() {
    return this.getCurrentView();
  }
}

//make this component available to the app
export default CaptureVideo;
