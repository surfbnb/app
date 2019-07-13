import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';
import captureIcon from '../../assets/capture_icon.png';
import stopIcon from '../../assets/stop_icon.png';
import ProgressBar from 'react-native-progress/Bar';
import styles from './styles';

const PROGRESS_FACTOR = 0.01;

class VideoRecorder extends Component {
  // static navigationOptions = {
  //   header: null
  // };
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      progress: 0,
      recordingInProgress: false
    };
    this.camera = null;
  }

  cameraView() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          ratio="16:9"
          zoom={0}
          autoFocusPointOfInterest={{ x: 0.5, y: 0.5 }}
          //videoStabilizationMode={RNCamera.Constants.VideoStabilization['auto']}
          notAuthorizedView={
            <View>
              <Text>The camera is not authorized!</Text>
            </View>
          }
          pendingAuthorizationView={
            <View>
              <Text>The camera is pending authorization!</Text>
            </View>
          }
          defaultVideoQuality={RNCamera.Constants.VideoQuality['480p']}
          defaultMuted={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel'
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel'
          }}
        >
          <ProgressBar
            width={null}
            color="#EF5566"
            progress={this.state.progress}
            indeterminate={false}
            style={styles.progressBar}
          />
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            {this.getActionButton()}
          </View>
        </RNCamera>
      </View>
    );
  }

  stopRecording() {
    // naviagate from here to other page
    this.camera && this.camera.stopRecording();
  }

  getActionButton() {
    if (this.state.isRecording) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.stopRecording();
          }}
        >
          <Image style={styles.captureButton} source={stopIcon} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={this.recordVideoAsync}>
          <Image style={styles.captureButton} source={captureIcon} />
        </TouchableOpacity>
      );
    }
  }

  initProgressBar() {
    this.progressInterval = setInterval(() => {
      if (this.state.progress < 1) {
        this.setState({ progress: this.state.progress + PROGRESS_FACTOR });
      } else {
        this.stopRecording();
      }
    }, 300);
  }

  recordVideoAsync = async () => {
    if (!this.camera) return;
    this.setState({ isRecording: true });
    const options = {
      quality: RNCamera.Constants.VideoQuality['480p'],
      base64: true,
      maxDuration: 30,
      muted: false,
      //codec: RNCamera.Constants.VideoCodec['H264'],
      orientation: 'portrait'
    };
    this.initProgressBar();
    const data = await this.camera.recordAsync(options);

    // This will take from VideoRecorder to PreviewRecordedVideo component
    this.props.toggleView(data.uri);
  };

  componentWillUnmount(){
    clearInterval(this.progressInterval);
  }

  render() {
      return this.cameraView();
  }
}

//make this component available to the app
export default VideoRecorder;
