import React, { Component } from 'react';
import { Modal } from 'react-native';
import VideoRecorder from '../VideoRecorder';
import PreviewRecordedVideo from '../PreviewRecordedVideo';
import NavigationService from '../../services/NavigationService';
import EventEmitter from 'eventemitter3';

export const captureVideoEventEmitter = new EventEmitter();

class CaptureVideo extends Component {
  // static navigationOptions = {
  //   header: null
  // };
  constructor(props) {
    super(props);
    this.state = {
      recordingScreen: true,
      videoUri: '',
      actionSheetOnRecordVideo: true,
      modalVisible: false
    };
  }

  componentDidMount = () => {
    captureVideoEventEmitter.on('show', this.showModal);
    captureVideoEventEmitter.on('hide', this.hideModal);
  };

  hideModal = () => {    
    this.setState({ modalVisible: false });
    NavigationService.navigate('HomeScreen');
  };

  showModal = () => {
    this.setState({ recordingScreen: true, modalVisible: true });
  };

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

  modalRequestClose = () => {
    if(this.state.recordingScreen){
      this.videoRecorder.cancleVideoHandling();
    } else {
      this.previewVideo.cancleVideoHandling();
    }
  }

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
          cachedvideoUrl={this.state.videoUri}
          navigation={this.props.navigation}
        />
      );
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={this.modalRequestClose}
      >
        {this.getCurrentView()}
      </Modal>
    );
  }
}

//make this component available to the app
export default CaptureVideo;
