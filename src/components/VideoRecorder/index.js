import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Text, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { RNCamera } from 'react-native-camera';
import captureIcon from '../../assets/capture_icon.png';
import stopIcon from '../../assets/stop_icon.png';
import ProgressBar from 'react-native-progress/Bar';
import styles from './styles';
import reduxGetters from '../../services/ReduxGetters';
import RNFS from 'react-native-fs';
import { ActionSheet } from 'native-base';
import Store from '../../store';
import { upsertRecordedVideo } from '../../actions';
import AllowAccessModal from '../Profile/AllowAccessModal';
import CameraIcon from '../../assets/camera_icon.png';

import AppConfig from '../../constants/AppConfig';

const ACTION_SHEET_BUTTONS = ['Reshoot', 'Continue with already recorded'];
const ACTION_SHEET_CONTINUE_INDEX = 1;
const ACTION_SHEET_RESHOOT_INDEX = 0;
const ACTION_SHEET_CANCEL_INDEX = 2;
const ACTION_SHEET_DESCTRUCTIVE_INDEX = 0;

const PROGRESS_FACTOR = 0.01;

class VideoRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      progress: 0,
      recordingInProgress: false
    };
    this.camera = null;
    this.recordedVideo = null;
  }

  async componentDidMount() {
    if (this.props.actionSheetOnRecordVideo) {
      this.recordedVideo = reduxGetters.getRecordedVideo();
      let isFileExists = false;
      const oThis = this;

      // this.showActionSheet();
      if (this.recordedVideo) {
        isFileExists = await RNFS.exists(this.recordedVideo);
      }

      if (isFileExists) {
        setTimeout(function() {
          oThis.showActionSheet();
        }, 100);
      }
    }
  }

  showActionSheet() {
    ActionSheet.show(
      {
        options: ACTION_SHEET_BUTTONS,
        title: 'You have already recorded video'
      },
      (buttonIndex) => {
        if (buttonIndex == ACTION_SHEET_RESHOOT_INDEX) {
          // This will start reshoot

          Store.dispatch(
            upsertRecordedVideo({
              do_discard: true
            })
          );
        } else if (buttonIndex == ACTION_SHEET_CONTINUE_INDEX) {
          //navigate to previous page
          this.props.goToPreviewScreen(this.recordedVideo);
        }
      }
    );
  }

  cancleVideoHandling = () => {
    this.props.navigation.goBack();
  };

  cameraView() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <RNCamera
            ref={(ref) => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.front}
            ratio={AppConfig.cameraConstants.RATIO}
            zoom={0}
            autoFocusPointOfInterest={{ x: 0.5, y: 0.5 }}
            notAuthorizedView={
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <AllowAccessModal
                  onClose={() => {
                    this.props.navigation.goBack();
                  }}
                  modalVisibility={true}
                  headerText="Camera"
                  accessText="Enable Camera Access"
                  accessTextDesc="Allow access to your camera and microphone to take video "
                  imageSrc={CameraIcon}
                />
              </View>
            }
            pendingAuthorizationView={
              <View>
                <Text>The camera is pending authorization!</Text>
              </View>
            }
            defaultVideoQuality={RNCamera.Constants.VideoQuality[AppConfig.cameraConstants.VIDEO_QUALITY]}
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
            <TouchableWithoutFeedback onPressIn={this.cancleVideoHandling}>
              <View style={styles.cancelButton}>
                <Text style={styles.cancelText}>X</Text>
              </View>
            </TouchableWithoutFeedback>
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
      </SafeAreaView>
    );
  }

  stopRecording = () => {
    // naviagate from here to other page
    this.camera && this.camera.stopRecording();
  };

  getActionButton() {
    let onPressCallback, source;
    if (this.state.isRecording) {
      onPressCallback = this.stopRecording;
      source = stopIcon;
    } else {
      onPressCallback = this.recordVideoAsync;
      source = captureIcon;
    }
    return (
      <TouchableOpacity onPress={onPressCallback}>
        <Image style={styles.captureButton} source={source} />
      </TouchableOpacity>
    );
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
      quality: RNCamera.Constants.VideoQuality[AppConfig.cameraConstants.VIDEO_QUALITY],
      base64: true,
      maxDuration: 30,
      muted: false,
      orientation: 'portrait'
    };
    this.initProgressBar();
    const data = await this.camera.recordAsync(options);

    // This will take from VideoRecorder to PreviewRecordedVideo component
    this.props.goToPreviewScreen(data.uri);
  };

  componentWillUnmount() {
    clearInterval(this.progressInterval);
  }

  render() {
    return this.cameraView();
  }
}

//make this component available to the app
export default VideoRecorder;
