import React, { PureComponent } from 'react';
import { TouchableOpacity, View, Image, BackHandler, AppState, Text } from 'react-native';
import Video from 'react-native-video';
import NavigationService from '../../services/NavigationService';
import ProgressBar from '../CommonComponents/ProgressBarWrapper';
import playIcon from '../../assets/preview_play_icon.png';
import Store from '../../store';
import { upsertRecordedVideo, videoInProcessing } from '../../actions';
import { ActionSheet } from 'native-base';
import styles from './styles';
import closeIcon from '../../assets/camera-cross-icon.png';
import LinearGradient from 'react-native-linear-gradient';
import multipleClickHandler from '../../services/MultipleClickHandler';
import AppConfig from '../../constants/AppConfig';

const ACTION_SHEET_BUTTONS = ['Reshoot', 'Discard', 'Cancel'];
const ACTION_SHEET_CANCEL_INDEX = 2;
const ACTION_SHEET_DESCTRUCTIVE_INDEX = 1;
const ACTION_SHEET_RESHOOT_INDEX = 0;

class Base extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paused: true, 
      activeIndex: 0
    };
    this.repeat = true;
    this._progressRef = null;
    this._video = null;
    this.currentVideoTime = 0;
    this.seekCount = 0;
    this.appStateTimeOut = 0;
    this.isVideoPlayedOnLoad = false;
    this.cachedVideoUri = this.props.cachedvideoUrl;
    this.cancleVideoHandling = this.cancleVideoHandling.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    AppState.addEventListener('change', this._handleAppStateChange);
    this.didFocus = this.props.navigation.addListener('didFocus', (payload) => {
      this.playVideo();
    });
    this.willBlur = this.props.navigation.addListener('willBlur', (payload) => {
      this.pauseVideo();
    });
    Store.dispatch(upsertRecordedVideo({
        raw_video_list: this.props.videoUrlsList,
        video_length: this.props.totalDuration,
        previewURL:  this.props.previewURL
    }));
  }

  playVideo(state={} , callback ){
    state["paused"] = false;
    this.setState(state);
  }

  pauseVideo(state={} , callback){
    state["paused"] = true;
    this.setState(state,callback);
  }

  replay() {
    this.playVideo();
    this.updateProgress(0);
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
    this.currentVideoTime = progress.currentTime;
    const val =  this.currentVideoTime / ( this.props.totalDuration / 1000) ;
    if(isNaN(val)) return;
    this.updateProgress(val);
  };

  handleEnd = () => {
    this.currentVideoTime = 0;
    this.seekCount = 0;
    this.pauseVideo();
    this.updateProgress(1);
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

  onPlaybackRateChange = (args) => {
    if(this.isPaused()) return;
    const playRate = args && args.playbackRate;
    /*
    * PlayRate is zero that means its video start or paused in between.
    * this.state.progress > 0  that means video hard started playing
    * !this.pauseVideo that means video is expedted to play
    * The below condition says that video was accidentally paused as playRate = 0 , but pauseVideo is false and video had progress.
    * */
    if (playRate == 0 && this.currentVideoTime > 0 && !this.isPaused() ){
      this.seekCount++;
      if (this.seekCount <= 5 ) {
        this._video && this._video.seek(this.currentVideoTime);
      } else {
        this.pauseVideo();
      }
    }}

  setRef = (ref) => {
    this._video = ref;
  }

  setProgressBarRef = (ref) => {
    this._progressRef = ref;
  }

  updateProgress = (val) => {
    this._progressRef && this._progressRef.updateProgress(val);
  }

  isPaused(){
    return this.state.paused || !this.shouldPlay();
  }

  shouldPlay(){
    return AppState.currentState == AppConfig.appStateMap.active;
  }

  getVideoUri = () => {
      return { uri:this.props.previewURL };
  }

  handleLoad= () => {
    if(!this.shouldPlay() || this.isVideoPlayedOnLoad) return;
    this.isVideoPlayedOnLoad =  true;
    setTimeout(()=> {
      this.playVideo();
    } , 100);
  };

  onVideoLoadError = () => {};

  render() {
    return (
      <View style={styles.container}>
        <Video
          ref={this.setRef}
          source={this.getVideoUri()}
          style={{flex:1, width: "100%", height: "100%"}}
          onPlaybackRateChange={this.onPlaybackRateChange}
          posterResizeMode={'cover'}
          resizeMode={'cover'}
          onLoad={this.handleLoad}
          onProgress={this.handleProgress}
          onEnd={this.handleEnd}
          ignoreSilentSwitch={'ignore'}
          onError={this.onVideoLoadError}
          paused={this.isPaused()}
          repeat={this.repeat}
        />
        <ProgressBar ref={this.setProgressBarRef} style={styles.progressBar} />
        <TouchableOpacity onPressIn={this.cancleVideoHandling} style={styles.closeBtWrapper}>
          <Image style={styles.closeIconSkipFont} source={closeIcon}></Image>
        </TouchableOpacity>

        <View style={styles.bottomControls}>
          <View style={{flex :1}}></View>
          <View style={{flex :1, alignItems: 'center', justifyContent: 'center'}}>
            {this.isPaused() ? (
              <TouchableOpacity
                onPress={() => {
                  this.replay();
                }}
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
                    this.pauseVideo({} , this.props.goToDetailsScreen);
                  })}
                  style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ color: '#fff', fontSize: 16 }}>NEXT</Text>
                </TouchableOpacity>
              </LinearGradient>
              <View style={styles.triangleRight}></View>
            </View>
          </View>
        </View>
      </View>
    );
  }


}



//make this component available to the app
export default Base;
