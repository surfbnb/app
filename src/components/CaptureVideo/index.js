import React, { Component } from 'react';
import VideoRecorder from '../VideoRecorder';
import PreviewRecordedVideo from '../PreviewRecordedVideo';
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
      hasVideoReplies: false
    };
    this.isVideoTypeReply = null;
    this.replyReceiverUserId = null;
    this.replyReceiverVideoId = null;
    this.amountToSendWithReply = null;
    this.videoType = null;
    this.proceedWithExisting = null;
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
    console.log('setReplyVideoParams', this.isVideoTypeReply );
    if (this.isVideoTypeReply){
      this.replyReceiverUserId = this.props.navigation.getParam("userId");
      this.replyReceiverVideoId = this.props.navigation.getParam("videoId");
      this.amountToSendWithReply = this.props.navigation.getParam("amount");
      this.setState({hasVideoReplies: this.props.navigation.getParam("videoReplyCount") > 0  });
    } else {
      // Do nothing.
    }
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
    this.videoType = recordedVideoObj.video_type || VideoTypesConfig.post.type;
    this.isVideoTypeReply  = this.videoType ===  VideoTypesConfig.reply.type;
    this.setState ({
      recordingScreen: false,
      videoUri: recordedVideoObj.raw_video
    });
  };


  saveVideoPrimaryInfo = () => {
   this.videoType = this.isVideoTypeReply ? VideoTypesConfig.reply.type : VideoTypesConfig.post.type;
   Store.dispatch(upsertRecordedVideo(this.getPrimaryVideoInfo()));
  };


  getPrimaryVideoInfo = () => {
      if (this.proceedWithExisting) return {};

    return this.videoType ===  VideoTypesConfig.reply.type ?
      { video_type: VideoTypesConfig.reply.type, reply_obj: this.getReplyOptions()} :
      { video_type: VideoTypesConfig.post.type };
  };


  goToDetailsScreen () {
    if (this.videoType ===  VideoTypesConfig.post.type){
      this.props.navigation.push('FanVideoDetails', this.getPrimaryVideoInfo());
    } else if (this.videoType ===  VideoTypesConfig.reply.type){
      this.props.navigation.push('FanVideoReplyDetails', this.getPrimaryVideoInfo());
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
          hasVideoReplies={this.state.hasVideoReplies}

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
    return this.getCurrentView();
  }
}

//make this component available to the app
export default CaptureVideo;
