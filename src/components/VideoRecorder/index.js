import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  BackHandler,
  AppState, FlatList, Dimensions,
  ScrollView, Animated
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import captureIcon from '../../assets/capture_icon.png';
import stopIcon from '../../assets/stop_icon.png';
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
const ACTION_SHEET_BUTTONS = ['Reshoot', 'Continue'];
const ACTION_SHEET_CONTINUE_INDEX = 1;
const ACTION_SHEET_RESHOOT_INDEX = 0;
const PROGRESS_FACTOR = 0.01;
let intervalID = null;

const ELEMENT_WIDTH = 80;
const MARGIN_LEFT_NORMAL =  (Dimensions.get('screen').width / 2 ) - ((ELEMENT_WIDTH + 4 )  /2);
const MARGIN_LEFT_HANDS_FREE =  (Dimensions.get('screen').width / 2 ) - ((ELEMENT_WIDTH + 4) /2) - (ELEMENT_WIDTH + 4);

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
      currentMode: 'NORMAL'
    };
    // this.currentMode = 'NORMAL';
    this.videoUrlsList = [];
    this.separationBars = [];
    this.camera = null;
    this.videoLength = 0;
    this.appStateTimeout = 0;
    this.recordedVideoObj = reduxGetters.getRecordedVideo();
  }

  _handleAppStateChange = (nextAppState) => {
    clearTimeout(this.appStateTimeout);
    setTimeout(()=> {
      if(nextAppState === 'inactive'){
        this.stopRecording();
        return;
      }

      if( nextAppState === 'background'){
        this.cancleVideoHandling();
      }
    } , 100 )
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
          style={styles.cameraView}
          type={this.state.cameraFrontMode ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
          ratio={AppConfig.cameraConstants.RATIO}
          zoom={0}
          pictureSize={AppConfig.cameraConstants.PICTURE_SIZE}
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

          <TouchableOpacity onPressIn={this.cancleVideoHandling} style={styles.closeBtWrapper}>
            <Image style={styles.closeIconSkipFont} source={closeIcon}></Image>
          </TouchableOpacity>
          <View style={{flex: 1, justifyContent: 'flex-end', width: '100%'}}>
          <View>
            {this.showTooltip()}
            <View style={styles.bottomWrapper }>
              {this.flipButton()}
              {this.getActionButton()}
              {this.previewButton()}
            </View>
            {this.renderModeRow()}
          </View>
          </View>
        </React.Fragment>
      );
    }
  };

  renderModeRow = () => {
    let elements =  ['Normal','Hands Free'].map((item, index)=> {
      return <TouchableWithoutFeedback key={index} onPress={()=>{
        if (index === 0) {
          this.setState({currentMode: 'NORMAL'});
          Animated.timing(this.state.marginLeft, {
            toValue: MARGIN_LEFT_NORMAL,
            duration: 200
          }).start();
        } else if(index === 1) {
          this.setState({currentMode: 'HANDS_FREE'});
          Animated.timing(this.state.marginLeft, {
            toValue: MARGIN_LEFT_HANDS_FREE,
            // easing: Easing.back(),
            duration: 200
          }).start();
        }
      }}
      >
      <View style={{marginHorizontal: 2, height: 30, width: ELEMENT_WIDTH, alignItems: 'center', justifyContent:'center'}}>
        <Text style={[{color: '#fff', fontWeight:'600' }, this.state.isRecording ? {opacity:0}:{}]}>{item}</Text>
      </View>
      </TouchableWithoutFeedback>
    });
    return <Animated.View onScroll={this.onScroll}  onMomentumScrollBegin={this.onMomentumScrollBegin}  onScrollBeginDrag={this.onScrollBeginDrag} horizontal={true} style={{marginLeft: this.state.marginLeft, flexDirection: 'row'}}>{elements}</Animated.View>
  };

  previewPressHandler = () => {
    if (this.discardVideo) return;
    // This will take from VideoRecorder to PreviewRecordedVideo component
    this.props.goToPreviewScreen(this.videoUrlsList, this.videoLength);

  };

  onBackPress = () => {
    let lastElementIndex = this.videoUrlsList.length - 2;
    let lastSegment = this.videoUrlsList[lastElementIndex] || {};
    this.videoUrlsList.pop();
    this.separationBars.pop();
    this.setState({progress: lastSegment.progress || 0 });
  };


  previewButton = () => {
    if (this.state.isRecording || this.videoUrlsList.length === 0) {
      return <View style={{flex:1}}/>
    }
    return <View style={{flex :1, alignItems: 'center', justifyContent: 'center'}}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={this.onBackPress}>
      <Image style={styles.backIcon} source={deleteCameraSegment}/>
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
    this.intervalManager(false);  // for clearInterval
    this.camera && this.camera.stopRecording();
  };

  appendNewBar = () => {
    let progress = Math.floor(this.state.progress * 100);
    if(progress === 100){
      return
    }
    this.separationBars.push((
      <View key={progress} style={{backgroundColor: '#fff', width: 2.5, height: 7, position: 'absolute', left: `${progress}%`}}>
      </View>));
  };

  showTooltip = () => {
    if (this.state.isRecording){
      return <></>;
    }
    return <View style={styles.tooltipWrapper}>
      <Text style={styles.tooltipStyle}>
        {this.state.currentMode === 'NORMAL' ? "Hold to record": "Tap to record" }
      </Text>
      <View style={styles.tooltipLowerTriangle } />
    </View>;
  };

  getActionButton() {
    let onPressCallback, source;
    if (this.state.currentMode === 'NORMAL') {
      return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPressIn={this.recordVideoAsync} onPressOut={this.stopRecording}>
          <Image style={styles.captureButtonSkipFont} source={captureIcon}/>
        </TouchableOpacity>
      </View>
    } else if (this.state.currentMode === 'HANDS_FREE') {
      if (this.state.isRecording) {
        onPressCallback = this.stopRecording;
        source = stopIcon;
      } else {
        onPressCallback = this.recordVideoAsync;
        source = captureIcon;
      }

      return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPress={onPressCallback}>
          <Image style={styles.captureButtonSkipFont} source={source}/>
        </TouchableOpacity>
      </View>
    }
  }

  flipButton() {
    if (!this.state.isRecording) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={this.flipCamera} >
            <Image style={styles.flipIconSkipFont} source={flipIcon} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return ( <View style={{flex:1}} /> )
    }
  }

  progressBarStateUpdate = () => {
      let progress =  this.state.progress + PROGRESS_FACTOR ;
      this.videoLength = progress * 100 * 300;
      if (this.state.progress < 1) {
        this.setState({ progress });
      } else {
        clearInterval(this.progressInterval);
        this.stopRecording();
        console.log('progressBarStateUpdate', this.videoLength);
        this.props.goToPreviewScreen(this.videoUrlsList, this.videoLength);
      }
  }



  initProgressBar() {
      this.intervalManager(true , this.progressBarStateUpdate, 300);
  }

  intervalManager(flag, animate, time) {
    if(flag)
      intervalID =  setInterval(animate, time);
    else
      clearInterval(intervalID);
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
    let data;
    try{
       data = await this.camera.recordAsync(options);
    } catch {
      this.setState({ isRecording: false });
    }

    let videoLength = this.state.progress * 100 * 300;
    console.log(videoLength, 'videoLength');
    if (videoLength <= 1000 ) {
      this.setState({ progress : 0 });
    } else {
      this.videoUrlsList.push({uri: data.uri, progress: this.state.progress});
      this.appendNewBar();
    }

    this.setState({ isRecording: false });
    // if (this.discardVideo) return;

    // This will take from VideoRecorder to PreviewRecordedVideo component
    // this.props.goToPreviewScreen(data.uri);
    // this.props.goToPreviewScreen(data.uri);
  };

  recordVideoStateChage() {
    this.setState({ isRecording: true });
    this.discardVideo = false;
  }

  componentWillUnmount() {
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
