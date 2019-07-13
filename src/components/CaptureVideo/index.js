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
      videoUri: ''
    };
  }

  toggleView(videoUri = '') {
    this.setState({
      recordingScreen: !this.state.recordingScreen,
      videoUri
    });
  }

  getCurrentView() {
    if (this.state.recordingScreen) {
      return (
        <VideoRecorder
          toggleView={(videoUri) => {
            this.toggleView(videoUri);
          }}
        />
      );
    } else {
      return (
        <PreviewRecordedVideo
          toggleView={() => {
            this.toggleView();
          }}
          cachedvideoUrl={this.state.videoUri}
        />
      );
    }
  }

  render() {
    console.log('I am here render of previewRecordedVideo');
    return this.getCurrentView();
  }
}

//make this component available to the app
export default CaptureVideo;
