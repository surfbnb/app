import React, { Component } from 'react';
import VideoRecorder from '../VideoRecorder';
import PreviewRecordedVideo from '../PreviewRecordedVideo';
import FanVideoDetails from '../FanVideoDetails';

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
      modalVisible: true
    };
  }

  goToRecordScreen() {
    this.setState({
      recordingScreen: true,
      actionSheetOnRecordVideo: false
    });
  }

  goToPreviewScreen(videoUri) {
    this.setState({
      recordingScreen: false,
      videoUri
    });
  }

  goToDetailsScreen() {
    this.props.navigation.push('FanVideoDetails');
  }

  modalRequestClose = () => {
    if (this.state.recordingScreen) {
      this.props.navigation.goBack();
    } else {
      this.previewVideo.cancleVideoHandling();
    }
  };

  getCurrentView() {
    if (this.state.recordingScreen) {
      return (
        <VideoRecorder
          ref={(recorder) => {
            this.videoRecorder = recorder;
          }}
          goToPreviewScreen={(videoUri) => {
            this.goToPreviewScreen(videoUri);
          }}
          actionSheetOnRecordVideo={this.state.actionSheetOnRecordVideo}
          navigation={this.props.navigation}
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
