import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Text, TouchableWithoutFeedback, BackHandler, AppState } from 'react-native';
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
import closeIcon from '../../assets/cross_icon.png';
import { withNavigation } from 'react-navigation';

import AppConfig from '../../constants/AppConfig';

const ACTION_SHEET_BUTTONS = ['Reshoot', 'Continue with already recorded'];
const ACTION_SHEET_CONTINUE_INDEX = 1;
const ACTION_SHEET_RESHOOT_INDEX = 0;
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

  _handleAppStateChange = (nextAppState) => {
    nextAppState === 'background' && this.cancleVideoHandling();
  };

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.cancleVideoHandling);
    AppState.addEventListener('change', this._handleAppStateChange);
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
    console.log('called by app state change: cancleVideoHandling');
    this.discardVideo = true;
    this.stopRecording();
    this.props.navigation.goBack();
  };

  cameraView() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.previewSkipFont}
          type={RNCamera.Constants.Type.front}
          ratio={AppConfig.cameraConstants.RATIO}
          zoom={0}
          autoFocusPointOfInterest={{ x: 0.5, y: 0.5 }}
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
          defaultVideoQuality={RNCamera.Constants.VideoQuality[AppConfig.cameraConstants.VIDEO_QUALITY]}
          defaultMuted={false}
        >
          <ProgressBar
            width={null}
            color="#EF5566"
            progress={this.state.progress}
            indeterminate={false}
            style={styles.progressBar}
          />

          <TouchableWithoutFeedback onPressIn={this.cancleVideoHandling}>
            <View style={styles.closeBtWrapper}>
              <Image style={styles.closeIconSkipFont} source={closeIcon}></Image>
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
        <Image style={styles.captureButtonSkipFont} source={source} />
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
    this.recordVideoStateChage();
    const options = {
      quality: RNCamera.Constants.VideoQuality[AppConfig.cameraConstants.VIDEO_QUALITY],
      base64: true,
      maxDuration: 30,
      muted: false,
      orientation: 'portrait'
    };
    this.initProgressBar();
    const data = await this.camera.recordAsync(options);
    if (this.discardVideo) return;
    // This will take from VideoRecorder to PreviewRecordedVideo component
    this.props.goToPreviewScreen(data.uri);
  };

  recordVideoStateChage() {
    this.setState({ isRecording: true });
    this.discardVideo = false;
  }

  componentWillUnmount() {
    clearInterval(this.progressInterval);
    this.recordVideoStateChage = () => {};
  }

  render() {
    return this.cameraView();
  }
}

//make this component available to the app
export default withNavigation(VideoRecorder);
