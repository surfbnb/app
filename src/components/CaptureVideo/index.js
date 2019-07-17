import React, { Component } from 'react';
import VideoRecorder from '../VideoRecorder';
import PreviewRecordedVideo from '../PreviewRecordedVideo';

class CaptureVideo extends Component {
  // static navigationOptions = {
  //   header: null
  // };
  constructor(props) {
    super(props);
    this.state = {
      recordingScreen: true,
      videoUri: '',
      actionSheetOnRecordVideo: true
    };
  }


  toggleView(videoUri = '') {
    
  }

  goToRecordScreen(){
    this.setState({
      recordingScreen: true,
      actionSheetOnRecordVideo: false
    });
  }

  goToPreviewScreen(videoUri){
    this.setState({
      recordingScreen: false,
      videoUri
    });
  }

  getCurrentView() {
    if (this.state.recordingScreen) {
      return (
        <VideoRecorder
          goToPreviewScreen={(videoUri) => {
            this.goToPreviewScreen(videoUri);
          }}
          actionSheetOnRecordVideo= {this.state.actionSheetOnRecordVideo}
        />
      );
    } else {
      return (
        <PreviewRecordedVideo
          goToRecordScreen={() => {
            this.goToRecordScreen();
          }}
          cachedvideoUrl={this.state.videoUri}
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
