import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Text, TouchableWithoutFeedback, BackHandler, AppState } from 'react-native';
import { RNCamera } from 'react-native-camera';
import captureIcon from '../../assets/capture_icon.png';
import stopIcon from '../../assets/stop_icon.png';
import flipIcon from '../../assets/camera.png';
import ProgressBar from 'react-native-progress/Bar';
import styles from './styles';
import reduxGetters from '../../services/ReduxGetters';
import RNFS from 'react-native-fs';
import { ActionSheet, Button } from 'native-base';
import Store from '../../store';
import { upsertRecordedVideo } from '../../actions';
import closeIcon from '../../assets/cross_icon.png';
import { withNavigation } from 'react-navigation';
import AppConfig from '../../constants/AppConfig';
import utilities from '../../services/Utilities';
import CurrentUser from '../../models/CurrentUser';
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
      recordingInProgress: false,
      acceptedCameraTnC: this.props.acceptedCameraTnC,
      cameraFrontMode: true
    };
    this.camera = null;
    this.recordedVideo = null;
  }

  _handleAppStateChange = (nextAppState) => {
    nextAppState === 'background' && this.cancleVideoHandling();
  };

  async componentDidMount() {
    if (this.props.acceptedCameraTnC === null){
      utilities.getItem(`${CurrentUser.getUserId()}-accepted-camera-t-n-c`).then((terms) => {
        this.setState({ acceptedCameraTnC: terms });
      });
    }
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    AppState.addEventListener('change', this._handleAppStateChange);
    if (this.props.actionSheetOnRecordVideo) {
      let recordedVideoObj = reduxGetters.getRecordedVideo();
      this.recordedVideo = recordedVideoObj.raw_video;
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
      } else if (Object.keys(recordedVideoObj).length > 0) {
        Store.dispatch(
          upsertRecordedVideo({
            do_discard: true
          })
        );
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

  cancelVideo = () => {
    this.discardVideo = true;
    this.stopRecording();
  };

  _handleBackPress = () => {
    this.cancelVideo();
  };

  cancleVideoHandling = () => {
    this.cancelVideo();
    this.props.navigation.goBack(null);
    ActionSheet.hide();
  };

  acceptCameraTerms = () => {
    this.setState({
      acceptedCameraTnC: 'true'
    });
  };

  flipCamera = () => {
    this.setState({ cameraFrontMode: !this.state.cameraFrontMode });
  };

  cameraView() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.previewSkipFont}
          type={this.state.cameraFrontMode ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
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
          {this.state.acceptedCameraTnC != 'true' && (
            <View style={styles.backgroundStyle}>
              <View style={{ padding: 26 }}>
                <Text style={styles.headerText}>Some Tips to help you get started on your first fan update</Text>

                <View style={{ backgroundColor: 'white', marginVertical: 26, height: 1 }} />

                <Text style={styles.headerText}>One More thing!</Text>

                <Text style={styles.smallText}>
                  Pepo has a review process for creators. Our team will help you get started once you create your first
                  video.   Once approved your video will appear in the feed or other user. In the mean time we will send
                  you timly updates about the review process
                </Text>

                <Button
                  style={{ alignSelf: 'center', backgroundColor: '#f56', padding: 14, marginTop: 24 }}
                  onPress={this.acceptCameraTerms}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                </Button>
              </View>
            </View>
          )}
          {this.showCameraActions()}
        </RNCamera>
      </View>
    );
  }

  showCameraActions = () => {
    if (this.state.acceptedCameraTnC == 'true') {
      return (
        <React.Fragment>
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
              flexDirection: 'row'
              // justifyContent: 'center'
            }}
          >
            {this.getActionButton()}
            {this.flipButton()}
          </View>
        </React.Fragment>
      );
    }
  };

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

  flipButton() {
    if (!this.state.isRecording) {
      return (
        <TouchableOpacity onPress={this.flipCamera}>
          <Image style={styles.flipIconSkipFont} source={flipIcon} />
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
    AppState.removeEventListener('change', this._handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
  }

  render() {
    return this.cameraView();
  }
}

//make this component available to the app
export default withNavigation(VideoRecorder);
