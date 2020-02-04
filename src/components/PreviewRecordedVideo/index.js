import React, { PureComponent } from 'react';
import {TouchableOpacity, View, Image, BackHandler, AppState, Text, Platform} from 'react-native';
import Video from 'react-native-video';
import NavigationService from '../../services/NavigationService';
import ProgressBar from './ProgressBarWrapper';
import playIcon from '../../assets/preview_play_icon.png';
import Store from '../../store';
import { upsertRecordedVideo, videoInProcessing } from '../../actions';
import { ActionSheet } from 'native-base';
import styles from './styles';
import closeIcon from '../../assets/camera-cross-icon.png';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import multipleClickHandler from '../../services/MultipleClickHandler';
import AppConfig from '../../constants/AppConfig';

const ACTION_SHEET_BUTTONS = ['Reshoot', 'Discard', 'Cancel'];
const ACTION_SHEET_CANCEL_INDEX = 2;
const ACTION_SHEET_DESCTRUCTIVE_INDEX = 1;
const ACTION_SHEET_RESHOOT_INDEX = 0;
const VIDEO_COMPONENT_ZERO = 'video-component-0';
const VIDEO_COMPONENT_ONE =  'video-component-1';

class PreviewRecordedVideo extends PureComponent {
  constructor(props) {
    super(props);

    this.videoUrlsList = this.props.videoUrlsList;
    this.state = {
      currentActiveComponent: VIDEO_COMPONENT_ZERO,
      paused: false
    };
    this._progressRef = null;
    this.indexOfVideo = 0;
    this.nextUrlComponentZero = this.videoUrlsList[0] || {};
    this.nextUrlComponentOne = {};
    // this.pauseVideo = false;
    this._video = null;
    this.seekCount = 0;
    this.currentTime = 0;
    this.totalVideoLength = this.props.totalVideoLength;
    this.appStateTimeOut = 0;
    this.videoZero = null;
    this.videoOne = null;
    this.duration = 0;
    this.seekCount = 0;
    this.appStateTimeOut = 0;

    this.cancleVideoHandling = this.cancleVideoHandling.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    AppState.addEventListener('change', this._handleAppStateChange);

    Store.dispatch(upsertRecordedVideo({ raw_video_list: this.videoUrlsList, video_length: this.totalVideoLength }));


    this.didFocus = this.props.navigation.addListener('didFocus', (payload) => {
      this.replayPreview();
    });
    this.willBlur = this.props.navigation.addListener('willBlur', (payload) => {
      this.pauseVideo();
    });
    setTimeout(()=> {
     if(!this.shouldPlay()) return;
      this.playVideo();
    }, 100)
  }

  playVideo = (state={}) => {
    state["paused"] = false;
    this.setState(state);
  }

  pauseVideo = (state={}) => {
    state['paused'] = true;

    this.setState(state);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.didFocus && this.didFocus.remove && this.didFocus.remove();
    this.willBlur.remove();
  }

  _handleAppStateChange = (nextAppState) => {
    clearTimeout(this.appStateTimeOut);
    this.appStateTimeOut = setTimeout(()=> {
      let currentRoute = NavigationService.findCurrentRoute();
      if(currentRoute !== 'CaptureVideo') return;
      if (nextAppState === 'active' ) {
        this.playVideo();
      }else {
        this.pauseVideo();
      }
    } , 100)
  };

  handleBackButtonClick = () => {
    if (this.props.navigation.isFocused()) {
      this.cancleVideoHandling();
      return true;
    }
  };

  handleProgress = (progress) => {
    if(this.isPaused()) return;
    this.currentTime = progress.currentTime;
    let totalProgress = (this.getPrevVideoDuration() / 1000) + progress.currentTime;
    this.updateProgress(totalProgress / (this.totalVideoLength / 1000));
  };


  cancleVideoHandling() {
    ActionSheet.show(
      {
        options: ACTION_SHEET_BUTTONS,
        cancelButtonIndex: ACTION_SHEET_CANCEL_INDEX,
        destructiveButtonIndex: ACTION_SHEET_DESCTRUCTIVE_INDEX,
        title: 'Discard or reshoot?'
      },
      (buttonIndex) => {
        if (buttonIndex == ACTION_SHEET_RESHOOT_INDEX) {
          // This will take to VideoRecorder component
          Store.dispatch(
            upsertRecordedVideo({
              do_discard: true
            })
          );
          this.props.saveVideoPrimaryInfo();
          this.props.goToRecordScreen();
        } else if (buttonIndex == ACTION_SHEET_DESCTRUCTIVE_INDEX) {
          this.props.navigation.goBack(null);
          Store.dispatch(
            upsertRecordedVideo({
              do_discard: true
            })
          );
          Store.dispatch(videoInProcessing(false));
        }
      }
    );
  }




  setProgressBarRef = (ref) => {
    this._progressRef = ref;
  };

  updateProgress = (val) => {
    this._progressRef && this._progressRef.updateProgress(val);
  }

  isPaused(){
    return this.state.paused || !this.shouldPlay();
  }

  shouldPlay(){
    return AppState.currentState === AppConfig.appStateMap.active;
  }

  isCurrentActiveComponentZero = () => {
    return this.state.currentActiveComponent === VIDEO_COMPONENT_ZERO;
  };

  isCurrentActiveComponentOne = () => {
    return this.state.currentActiveComponent === VIDEO_COMPONENT_ONE;
  }


  showVideoComp = () => {

    const isShowingComponent0 = this.isCurrentActiveComponentZero();
    const isShowingComponent1 = !isShowingComponent0;
    console.log('this.nextUrlComponentZero.uri, this.nextUrlComponentOne.uri, isShowingComponent0, isShowingComponent1');
    console.log(this.nextUrlComponentZero.uri, this.nextUrlComponentOne.uri, isShowingComponent0, isShowingComponent1);
    return <View style={{flex: 1}}>
      <Video
        source={{uri: this.nextUrlComponentZero.uri}}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          flex: (isShowingComponent0 ? 1 : 0)
        }}
        onPlaybackRateChange={this.onPlaybackRateChange}
        posterResizeMode={'cover'}
        resizeMode={'cover'}
        onProgress={this.handleProgress}
        onEnd={this.handleEndZero}
        repeat={this.isRepeatModeOn()}
        ref={(component) => {
          this.videoZero = component;
        }}
        paused={isShowingComponent0 ? this.state.paused : true}
      />
      <Video
        source={{uri: this.nextUrlComponentOne.uri }}
        style={{
          flex: isShowingComponent1 ? 1 : 0
        }}
        onPlaybackRateChange={this.onPlaybackRateChange}
        posterResizeMode={'cover'}
        resizeMode={'cover'}
        onProgress={this.handleProgress}
        onEnd={this.handleEndOne}
        repeat={this.isRepeatModeOn()}
        ref={(component) =>   {this.videoOne = component; }}
        paused={isShowingComponent1 ? this.state.paused : true }
      />
    </View>
  };

  isRepeatModeOn = () => {
    return  Platform.OS === "android" ;
  }

  onPlaybackRateChange = (args) => {
    if(this.isPaused()) return;
    const playRate = args && args.playbackRate;
    /*
    * PlayRate is zero that means its video start or paused in between.
    * this.state.progress > 0  that means video hard started playing
    * !this.pauseVideo that means video is expedted to play
    * The below condition says that video was accidentally paused as playRate = 0 , but pauseVideo is false and video had progress.
    * */
    if (playRate === 0 && this.currentTime > 0 && !this.isPaused() ){
      this.seekCount++;
      if (this.seekCount <= 8 ) {
        let video = this.isCurrentActiveComponentZero() ?  this.videoZero : this.videoOne ;
        video && video.seek(this.currentTime);
      } else {
        this.pauseVideo();
      }
    }
  };

  switchVideo = () => {
    if (Platform.OS === 'android'){
      //In case of Android, we explicitly need to do this, to play next video
      this.pauseVideo();
      setTimeout(()=> {  this.playVideo(); },0);
    }
  };


  handleEndOne = () => {
    this.nextUrlComponentZero =  this.getNextVideoUri();
    // this.nextUrlComponentOne =  {};
    this.handleEnd();
  };

  handleEndZero = () => {
    this.nextUrlComponentOne = this.getNextVideoUri();
    // this.nextUrlComponentZero =  {};
    this.handleEnd();
  };


  handleEnd = () => {
    this.seekCount = 0;
    if (this.videoUrlsList.length - 1 === this.indexOfVideo ) {
      this.pauseVideo();
      this.updateProgress(1);
      return;
    }
    this.setState(
      {
        currentActiveComponent: this.isCurrentActiveComponentOne()
          ? VIDEO_COMPONENT_ZERO :
          VIDEO_COMPONENT_ONE
      }, ()=>{
        this.switchVideo();
      });
    this.indexOfVideo += 1;
  };

  getNextVideoUri = () => {
    if (this.videoUrlsList.length === 1){
      return this.videoUrlsList[0] || {} ;
    }
    return this.videoUrlsList[this.indexOfVideo + 1] || {} ;
  };

  getPrevVideoDuration = () => {
    if (this.indexOfVideo < 1){
      return 0;
    }
    return this.videoUrlsList[this.indexOfVideo - 1].progress * 100 * 300;
  };

  replay = () => {
    this.indexOfVideo  = 0;
    this.currentTime = 0;
    if (this.isCurrentActiveComponentZero()) {
      this.nextUrlComponentOne = this.videoUrlsList[this.indexOfVideo] || {};
      this.nextUrlComponentZero = {};
      this.setState( {
        currentActiveComponent: VIDEO_COMPONENT_ONE
      });
    } else if (this.isCurrentActiveComponentOne()) {
      this.nextUrlComponentOne = {};
      this.nextUrlComponentZero = this.videoUrlsList[this.indexOfVideo] || {};
      this.setState( {
        currentActiveComponent: VIDEO_COMPONENT_ZERO
      });
    }
    let video = this.isCurrentActiveComponentZero() ? this.videoZero : this.videoOne;
    video && video.seek(this.currentTime);
    this.playVideo();
    this.updateProgress(0);

  };

  replayPreview = () => {
    this.replay();
    setTimeout(this.replayOnAndroid, 100);
  };


  replayOnAndroid = () => {
    if(Platform.OS === 'android' && this.videoUrlsList.length === 1){
      // This is hack for android to preview video on clicking play icon.
      this.replay();
    }
  };



  render() {
    return (
      <View style={styles.container}>
        {this.showVideoComp()}
        <ProgressBar ref={this.setProgressBarRef}/>
        <TouchableOpacity onPressIn={this.cancleVideoHandling} style={styles.closeBtWrapper}>
          <Image style={styles.closeIconSkipFont} source={closeIcon} />
        </TouchableOpacity>

        <View style={styles.bottomControls}>
          <View style={{flex :1}}></View>
          <View style={{flex :1, alignItems: 'center', justifyContent: 'center'}}>
            {this.isPaused() ? (
              <TouchableOpacity
                onPress={this.replayPreview}
              >
                <Image style={styles.playIconSkipFont} source={playIcon} />
              </TouchableOpacity>
            ) : (
              <View style={styles.playIconSkipFont} />
            )}
          </View>

            <View style={{flex :1, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{ flexDirection: 'row' }}>
                <LinearGradient
                  colors={['#ff7499', '#ff5566']}
                  locations={[0, 1]}
                  style={{
                    borderRadius: 0,
                    borderTopLeftRadius: 3,
                    borderBottomLeftRadius: 3,
                    paddingLeft: 15,
                    paddingRight: 10
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <TouchableOpacity
                    onPress={multipleClickHandler(() => {
                      this.props.goToDetailsScreen();
                    })}
                    style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: '#fff', fontSize: 16 }}>NEXT</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <View style={styles.triangleRight} />
              </View>
            </View>
        </View>
      </View>
    );
  }

}

//make this component available to the app
export default withNavigation(PreviewRecordedVideo);
