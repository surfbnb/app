import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  Easing,
  TouchableWithoutFeedback,
  BackHandler,
  AppState, Dimensions, Animated, Alert
} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import { RNCamera } from 'react-native-camera';
import deleteCameraSegment  from '../../assets/delete_camera_segment.png';
import flipIcon from '../../assets/flip_camera.png';
import ProgressBar from 'react-native-progress/Bar';
import styles from './styles';
import reduxGetters from '../../services/ReduxGetters';
import RNFS from 'react-native-fs';
import { ActionSheet, Button } from 'native-base';
import Store from '../../store';
import { upsertRecordedVideo } from '../../actions';
import closeIcon from '../../assets/camera-cross-icon.png';
import closeIconWhite from '../../assets/cross-icon-white.png';
import { withNavigation } from 'react-navigation';
import AppConfig from '../../constants/AppConfig';
import deepGet from 'lodash/get';
import LinearGradient from "react-native-linear-gradient";
import Theme from "../../theme/styles";
import multipleClickHandler from "../../services/MultipleClickHandler";
import TouchableButton from "../FanVideoReplyDetails/TouchableButton";
import Pricer from "../../services/Pricer";
import Toast from "../../theme/components/NotificationToast";
import utilities from '../../services/Utilities';
const ACTION_SHEET_BUTTONS = ['Reshoot', 'Continue'];
const ACTION_SHEET_CONTINUE_INDEX = 1;
const ACTION_SHEET_RESHOOT_INDEX = 0;
const PROGRESS_FACTOR = 0.01;

const ELEMENT_WIDTH = 80;
const MARGIN_LEFT_NORMAL =  (Dimensions.get('screen').width / 2 ) - ((ELEMENT_WIDTH + 4 )  /2);
const MARGIN_LEFT_HANDS_FREE =  (Dimensions.get('screen').width / 2 ) - ((ELEMENT_WIDTH + 4) /2) - (ELEMENT_WIDTH + 4);
const TAP_TO_RECORD = 'TAP_TO_RECORD';
const LONG_PRESS_TO_RECORD = 'LONG_PRESS_TO_RECORD';

class VideoRecorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      progress: 0,
      recordingInProgress: false,
      acceptedCameraTnC: this.props.acceptedCameraTnC,
      showLightBoxOnReply: this.props.showLightBoxOnReply,
      cameraFrontMode: true,
      isLocalVideoPresent: false,
      marginLeft: new Animated.Value(MARGIN_LEFT_NORMAL),
      currentMode: null,
      scale: new Animated.Value(1)
    };
    /*
     these variables are used because setting state variables is async task
   */
    this.shallowCurrentMode = null;
    this.shallowIsRecording = false;
    this.stoppedUnexpectedly = false;
    this.actionButtonDisabled = false;
    this.intervalID = null;
    this.videoUrlsList = [];
    this.separationBars = [];
    this.camera = null;
    this.videoLength = 0;
    this.recordedVideoObj = reduxGetters.getRecordedVideo();
  }

  _handleAppStateChange = (nextAppState) => {

      if(nextAppState === 'inactive' || nextAppState === 'background'){
        if (this.state.isRecording){
          this.stoppedUnexpectedly = true;
          this.stopRecording();
        } else {
          this.stoppedUnexpectedly = false;
          this.previewPressHandler();
        }
      }
  };

  componentDidUpdate(prevProps, prevState){
    //@Mayur change this code. Catch the ref and update the state directly
    if( prevProps.acceptedCameraTnC != this.props.acceptedCameraTnC ){
     this.setState({acceptedCameraTnC: this.props.acceptedCameraTnC })
    }
    if ( prevProps.showLightBoxOnReply != this.props.showLightBoxOnReply ) {
      this.setState({showLightBoxOnReply: this.props.showLightBoxOnReply })
    } 
  }

  isStaleReduxObjectPresent(){
     let acceptableKeys = ['reply_obj', 'video_type'];
     for (let key in this.recordedVideoObj) {
      if (! acceptableKeys.includes(key)){
        return true;
      }
     }
     return false;
  }

  async componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    AppState.addEventListener('change', this._handleAppStateChange);
    if (this.props.actionSheetOnRecordVideo) {
      let isFileExists = await this.ifLocalVideoPresent();
      const oThis = this;
      if (isFileExists) {
        this.setState({ isLocalVideoPresent: true });
        setTimeout(function() {
          oThis.showActionSheet();
        }, 100);
      } else if (this.isStaleReduxObjectPresent()) {
        Store.dispatch(
          upsertRecordedVideo({
            do_discard: true
          })
        );
      } else {
        this.props.saveVideoPrimaryInfo();
      }
    }
  }

  showActionSheet() {
    ActionSheet.show(
      {
        options: ACTION_SHEET_BUTTONS,
        title: this.props.getActionSheetText(this.recordedVideoObj)
      },
      (buttonIndex) => {
        if (buttonIndex == ACTION_SHEET_RESHOOT_INDEX) {
          // This will start reshoot

          Store.dispatch(
            upsertRecordedVideo({
              do_discard: true
            })
          );
          this.props.saveVideoPrimaryInfo();
        } else if (buttonIndex == ACTION_SHEET_CONTINUE_INDEX) {
          //navigate to previous page
          this.props.proceedWithExistingVideo(this.recordedVideoObj);
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

  replyToVideo = () => {
    this.setState({
      showLightBoxOnReply: false
    });
  };

  flipCamera = () => {
    this.setState({ cameraFrontMode: !this.state.cameraFrontMode });
  };


  ifLocalVideoPresent = async  () => {
    let recordedVideoList = this.recordedVideoObj.raw_video_list || [];
    recordedVideoList = recordedVideoList.map((ele)=>ele.uri);
    console.log(recordedVideoList, '=====recordedVideoList=====');
    if (recordedVideoList.length === 0){
      return false;
    }

    for (let video of recordedVideoList){
      let isFileExists = await RNFS.exists(video);
      if (!isFileExists){
        return false;
      }
    }
    return true;
  };

  getPepoAmount = () => {
    let amount = reduxGetters.getBtAmountForReply(this.props.videoId);
    return Pricer.getToBT(Pricer.getFromDecimal(amount), 2);
  };

  getUserFullName = () => {
    let userId = reduxGetters.getVideoCreatorUserId(this.props.videoId);
    return reduxGetters.getName(userId)
  };


  showCoachForPosting = () => {
    // If already recorded video present in local, do not show coach.
    if (this.state.isLocalVideoPresent) return;

    if (this.props.isVideoTypeReply) {
      // TODO: return coach for posting
      if (this.state.showLightBoxOnReply){
        // Show video
        return <View style={styles.backgroundStyle}>
          <TouchableOpacity onPressIn={this.cancleVideoHandling} style={[styles.closeBtWrapper, {top: 25}]}>
            <Image style={{height: 16.6, width: 16.6}} source={closeIconWhite}></Image>
          </TouchableOpacity>
          <View style={{ padding: 26, alignItems: 'center'}}>

            <Text style={[styles.smallText, {fontWeight: '600'}]}>
              Post a reply
            </Text>


            <Text style={[styles.miniText, {textAlign: 'center'}]}>
              Reply to {this.getUserFullName()}'s video for {this.getPepoAmount()} Pepo Coins
            </Text>

            <LinearGradient
              colors={['#ff7499', '#ff5566']}
              locations={[0, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ alignSelf: 'center', paddingHorizontal: 15, marginTop: 30, borderRadius: 3 }}
            >
              <TouchableButton
                TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0 }]}
                TextStyles={[Theme.Button.btnPinkText]}
                style={{marginBottom: 20}}
                textBeforeImage='Reply | '
                textAfterImage={this.getPepoAmount()}
                onPress={multipleClickHandler(() => {
                  this.replyToVideo();
                })}
              />
            </LinearGradient>

          </View>
        </View>
      }
      // if (no video reply present) { return Coach }
    } else {
      if (this.state.acceptedCameraTnC !== 'true') {

        return <View style={styles.backgroundStyle}>
          <View style={{ padding: 26 }}>
            <Text style={styles.headerText}>Submit your first video</Text>

            <Text style={styles.smallText}>
              Create a 30 second video update. Share what you're working on, what excites you, or anything on your
              mind.
            </Text>

            <View style={{ backgroundColor: 'white', marginVertical: 26, height: 1 }} />

            <Text style={styles.headerText}>Approval process</Text>

            <Text style={styles.smallText}>
              The Pepo team will review your first video before it is shared publicly. We'll get in touch with you
              ASAP!
            </Text>

            <LinearGradient
              colors={['#ff7499', '#ff5566']}
              locations={[0, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ alignSelf: 'center', paddingHorizontal: 15, marginTop: 30, borderRadius: 3 }}
            >
              <TouchableOpacity
                onPress={this.acceptCameraTerms}
                style={[Theme.Button.btn, { borderWidth: 0 }]}
              >
                <Text style={[
                  Theme.Button.btnPinkText,
                  { fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center' }
                ]}>
                  Get Started
                </Text>
              </TouchableOpacity>
            </LinearGradient>

          </View>
        </View>

      }
    }
  };

  cameraView() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.cameraViewSkipFont}
          type={this.state.cameraFrontMode ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
          ratio={AppConfig.cameraConstants.RATIO}
          zoom={0}
          pictureSize={AppConfig.cameraConstants.PICTURE_SIZE}
          autoFocusPointOfInterest={utilities.isAndroid() ? { x: 0.5, y: 0.5 } : {}}
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
          {this.showCoachForPosting()}
          {this.showCameraActions()}
        </RNCamera>
      </View>
    );
  }


  shouldShowActionButtons = () => {

    if (this.state.isLocalVideoPresent){
      // If local video present, coach screen will not be seen. So we need to show action buttons.
      return true;
    }

    if (this.props.isVideoTypeReply){
      // If video type is reply and has video replies then we will not show coach and we need to show action buttons
      return ! this.state.showLightBoxOnReply;
    } else {
      // If video type is post and terms and conditions are accepted then we will not show coach and we need to show action buttons
      return this.state.acceptedCameraTnC === 'true';
    }

  };

  plotSeparationBars = () => {
    let plotBars = this.separationBars.map((ele)=> ele);
    return plotBars;
  };

  askCancelConfirmation = () => {
    if (this.videoLength > 0){
      Alert.alert(
        '',
        'Video segments will be discarded. Do you want to continue?',
        [
          {text: 'Confirm', onPress:  this.cancleVideoHandling},
          {
            text: 'Cancel',
            style: 'cancel'
          }

        ],
        {cancelable: true},
      );
    } else {
      this.cancleVideoHandling();
    }
  };


  showCameraActions = () => {
    if (this.shouldShowActionButtons()) {
      return (
        <React.Fragment>
          <View style={{position: 'relative', height: 7, width: '90%'}}>
          <ProgressBar
            width={null}
            color="#EF5566"
            progress={this.state.progress}
            indeterminate={false}
            style={styles.progressBar}
          />
            <React.Fragment>
              {this.plotSeparationBars()}
            </React.Fragment>
          </View>

          <TouchableOpacity onPressIn={this.askCancelConfirmation } style={styles.closeBtWrapper}>
            <Image style={styles.closeIconSkipFont} source={closeIcon} />
          </TouchableOpacity>
          <View style={{flex: 1, justifyContent: 'flex-end', width: '100%'}}>
          <View>
            {/*{this.showTooltip()}*/}
            <View style={styles.bottomWrapper }>
              {this.flipButton()}
              {this.getActionButton()}
              {this.previewButton()}
            </View>
            {/*{this.renderModeRow()}*/}
          </View>
          </View>
        </React.Fragment>
      );
    }
  };

  previewPressHandler = () => {
    if (this.discardVideo) return;
    // This will take from VideoRecorder to PreviewRecordedVideo component
    let videoLength = this.state.progress * 100 * 300;
    if(videoLength <= 1000) {
      Toast.show({text:'Please create longer video', icon: 'error' });
      return;
    }
    this.props.goToPreviewScreen(this.videoUrlsList, this.videoLength);

  };

  onBackPress = () => {
    Alert.alert(
      '',
      'Are you sure you want to delete last segment?',
      [
        {text: 'Confirm', onPress:  this.deleteLastSegment },
        {
          text: 'Cancel',
          style: 'cancel'
        }

      ],
      {cancelable: true},
    );
  };

  deleteLastSegment = () => {
    this.videoUrlsList.pop();
    this.separationBars.pop();
    this.goToLastProgress();
  };

  goToLastProgress = () => {
    let lastElementIndex = this.videoUrlsList.length - 1;
    let lastSegment = this.videoUrlsList[lastElementIndex] || {};
    this.videoLength = (lastSegment.progress || 0) * 100 *300;
    this.setState({progress: lastSegment.progress || 0 }, ()=>{  });
  };

  previewButton = () => {
    if (this.state.isRecording || this.videoUrlsList.length === 0) {
      return <View style={{flex:1}}/>
    }
    return <View style={{flex :1, alignItems: 'center', justifyContent: 'center'}}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={this.onBackPress}>
      <Image style={styles.backIconSkipFont} source={deleteCameraSegment}/>
      </TouchableOpacity>
      <LinearGradient
        colors={['#ff7499', '#ff5566']}
        locations={[0, 1]}
        style={{
          borderRadius: 3,
          paddingLeft: 10,
          paddingRight: 10,
          marginLeft:8
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          onPress={multipleClickHandler(() => {
            this.previewPressHandler()
          })}
            style={{ height: 40,  alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 12 }}>PREVIEW</Text>
        </TouchableOpacity>
      </LinearGradient>
      {/*<View style={styles.triangleRight}></View>*/}
    </View>
    </View>
  };

  stopRecording = () => {
    this.changeIsRecording(false);
    this.changeCurrentMode(null);
    // this.setState({isRecording:false});
    this._stopRecordingAnimation();
    this.camera && this.camera.stopRecording();
  };

  appendNewBar = () => {
    let progress = Math.floor(this.state.progress * 100);
    // for last segment we need a invisible view else there will be a problem when segment is deleted.
    // That is why height :0 , width : 0 is given
    // Problem: On every delete segment, we delete one red segment line and one white separator.
    this.separationBars.push((
      <View key={`progress-${Date.now()}`} style={[styles.separationBarsStyle, {left: `${progress}%`}, progress === 100 ? {height:0, width:0} : {}]}>
      </View>));
  };

  // showTooltip = () => {
  //   if (this.state.isRecording){
  //     return <></>;
  //   }
  //   return <View style={styles.tooltipWrapper}>
  //     <Text style={styles.tooltipStyle}>
  //       {this.state.currentMode === LONG_PRESS_TO_RECORD ? "Hold to record": "Tap to record" }
  //     </Text>
  //     <View style={styles.tooltipLowerTriangle } />
  //   </View>;
  // };

  _recordingAnimation = () => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.scale, {
          toValue: 1.8,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(this.state.scale, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

  };

  _stopRecordingAnimation = () => {
    Animated.spring(this.state.scale, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true
    }).start();
  };

  handleOnPressIn = () => {
    console.log('************handleOnPressIn isRecording: '+ this.state.isRecording +' shallowIsRecording: '+ this.shallowIsRecording + ' Mode: ' + this.state.currentMode + ' ShallowMode:'+ this.shallowCurrentMode);

    if(this.state.isRecording || this.shallowIsRecording){
      this.stopRecording();
      // this.changeCurrentMode(null);
      // this.setState({currentMode : null});
    } else {
      this.recordVideoAsync();
    }
    console.log('************After:handleOnPressIn isRecording: '+ this.state.isRecording +' shallowIsRecording: '+ this.shallowIsRecording + ' Mode: ' + this.state.currentMode + ' ShallowMode:'+ this.shallowCurrentMode);


  }

  handleOnPressOut = () => {
    console.log('************handleOnPressOut isRecording: '+ this.state.isRecording +' shallowIsRecording: '+ this.shallowIsRecording + ' Mode: ' + this.state.currentMode + ' ShallowMode:'+ this.shallowCurrentMode);

    if ((this.state.currentMode === LONG_PRESS_TO_RECORD || this.shallowCurrentMode === LONG_PRESS_TO_RECORD ) && (this.state.isRecording || this.shallowIsRecording)){
      this.stopRecording();
      // this.changeCurrentMode(null);
      // this.setState({currentMode: null});
    }

    console.log('************After:handleOnPressOut isRecording: '+ this.state.isRecording +' shallowIsRecording: '+ this.shallowIsRecording + ' Mode: ' + this.state.currentMode + ' ShallowMode:'+ this.shallowCurrentMode);


  };

  handleOnPress = () => {
    console.log('************handleOnPress isRecording: '+ this.state.isRecording +' shallowIsRecording: '+ this.shallowIsRecording + ' Mode: ' + this.state.currentMode + ' ShallowMode:'+ this.shallowCurrentMode);

    if (this.state.isRecording || this.shallowIsRecording) {
      this.changeCurrentMode(TAP_TO_RECORD);
      // this.setState({currentMode: TAP_TO_RECORD});
    } else {
      // Just for safety.
      this.changeCurrentMode(null);
      // this.setState({currentMode: null});
    }

    console.log('************After:handleOnPress isRecording: '+ this.state.isRecording +' shallowIsRecording: '+ this.shallowIsRecording + ' Mode: ' + this.state.currentMode + ' ShallowMode:'+ this.shallowCurrentMode);

  };

  handleOnLongPress = () => {
    console.log('************handleOnLongPress isRecording: '+ this.state.isRecording +' shallowIsRecording: '+ this.shallowIsRecording + ' Mode: ' + this.state.currentMode + ' ShallowMode:'+ this.shallowCurrentMode);

    if (this.state.isRecording || this.shallowIsRecording) {
      this.changeCurrentMode(LONG_PRESS_TO_RECORD);
      // this.setState({currentMode: LONG_PRESS_TO_RECORD});
    } else {
      // Just for safety.
      this.changeCurrentMode(null);
      // this.setState({currentMode: null});
    }

    console.log('************After:handleOnLongPress isRecording: '+ this.state.isRecording +' shallowIsRecording: '+ this.shallowIsRecording + ' Mode: ' + this.state.currentMode + ' ShallowMode:'+ this.shallowCurrentMode);
  };

  stopIcon = () => <View style={styles.squareIcon}></View>

  captureIcon = () => <View style={[styles.innerCircle]}></View>

  getSource = () => {
    if (this.state.isRecording){
      return this.state.currentMode === TAP_TO_RECORD ? this.stopIcon() : this.captureIcon();
    } else {
      return this.captureIcon();
    }
  };

  getActionButton() {

    if(this.videoLength >= 30000){
      this.actionButtonDisabled = true;
    } else {
      this.actionButtonDisabled = false;
    }

    let modColor = this.state.scale.interpolate({
      inputRange: [1, 1.000001, 1.8],
      outputRange: [0.5, 0.9, 1],
      extrapolate: 'clamp',
    });

    let animationStyle = {
      opacity: modColor,
      transform: [{scale: this.state.scale}]
    };

    let onPressCallback, source;

      return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
          disabled={this.actionButtonDisabled}
          onPressIn={this.handleOnPressIn}
          onPressOut={this.handleOnPressOut}
          onPress={this.handleOnPress}
          onLongPress={this.handleOnLongPress}
          delayLongPress={2000}
          activeOpacity={0.9}
        >
          <View style={[ {position: 'relative'},  this.getDisabledButtonStyle() ]}>
            <Animated.View style={[styles.outerCircle, animationStyle]}></Animated.View>
            {this.getSource()}
          </View>
        </TouchableOpacity>
      </View>
  }

  getDisabledButtonStyle = () => {
    if(this.videoLength >= 30000){
      return {opacity: 0.5}
    } else {
      return {opacity: 1}
    }
  }

  flipButton() {
    if (!this.state.isRecording) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={this.flipCamera} activeOpacity={0.75}>
            <Image style={styles.flipIconSkipFont} source={flipIcon} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return ( <View style={{flex:1}} /> )
    }
  }

  progressBarStateUpdate = () => {
    if(! this.state.isRecording) return;
      let currentProgress =  this.state.progress ;
      let progress = currentProgress + PROGRESS_FACTOR ;
      this.videoLength = progress * 100 * 300;
      console.log('this.state.progress');
      if (currentProgress <= 1) {
        this.setState({ progress });
      } else {
        this.stopRecording();
      }
  }



  initProgressBar() {
      this.intervalManager(true , this.progressBarStateUpdate, 300);
  }

  intervalManager(flag, animate, time) {
    if(flag){
      this.intervalID =  setInterval(animate, time);
    } else {
      clearInterval(this.intervalID);
    }

  }

  recordVideoAsync =  () => {
    if (!this.camera) return;
    let currentTime = Date.now();
    const options = {
      quality: RNCamera.Constants.VideoQuality[AppConfig.cameraConstants.VIDEO_QUALITY],
      base64: true,
      muted: false,
      orientation:  'portrait'
    };
    let data;
    this.recordVideoStateChage();
    this.changeIsRecording(true);
    this.setState({isRecording:true},
      async ()=> {
        this.progressBarStateUpdate();
        this.initProgressBar();
        this._recordingAnimation().start();
        try{
           data = await this.camera.recordAsync(options);
        } catch(exception) {
          console.log('recordVideoAsync:::::catch', exception);
          this.goToLastProgress();
          this.changeIsRecording(false);
          // this.setState({ isRecording: false });
          return;
        } finally {
          // for clearInterval
          this.intervalManager(false);
        }
        let videoLength = this.state.progress * 100 * 300;
        console.log(videoLength, 'videoLength');
        this.videoUrlsList.push({uri: data.uri, progress: this.state.progress});
        this.appendNewBar();
        this.changeIsRecording(false);
        // this.setState({ isRecording: false });
        if(this.stoppedUnexpectedly){
          this.previewPressHandler();
          this.stoppedUnexpectedly = false;
        }

      });
  };

  recordVideoStateChage() {
    // this.setState({ isRecording: true });
    this.discardVideo = false;
  }

  changeIsRecording = (isRecording) => {
    this.setState({ isRecording });
    this.shallowIsRecording = isRecording;
  }

  changeCurrentMode = (currentMode) => {
    this.setState({ currentMode });
    this.shallowCurrentMode = currentMode;
  }


  componentWillUnmount() {
    this.recordVideoStateChage = () => {};
    this.recordVideoAsync = () => {};
    this.progressBarStateUpdate = () => {};
    this.stopRecording = () => {};
    this.goToLastProgress = () => {};
    this.acceptCameraTerms = () => {};
    this.replyToVideo = () => {};
    this.flipCamera = () => {};
    this.handleOnPressIn = () => {};
    this.handleOnPressOut = () => {};
    this.handleOnPress = () => {};
    this.handleOnLongPress = () => {};
    AppState.removeEventListener('change', this._handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    this.shallowCurrentMode = null;
    this.shallowIsRecording = false;
  }

  render() {
    return this.cameraView();
  }
}

//make this component available to the app
export default withNavigation(VideoRecorder);
