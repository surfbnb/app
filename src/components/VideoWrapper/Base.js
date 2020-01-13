import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback, AppState, View, Image, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import Video from 'react-native-video';
import inlineStyles from './styles';
import playIcon from '../../assets/play_icon.png';
import PixelCall from '../../services/PixelCall';
import {VideoPlayPauseEmitter} from '../../helpers/Emitters';
import AppConfig from '../../constants/AppConfig';
import socketPixelCall from './../../services/SocketPixelCall'
import CurrentUser from "../../models/CurrentUser";
import assignIn from 'lodash/assignIn';


const VIDEO_PLAY_START_EVENT_NAME = "video_play_start";
const VIDEO_PLAY_END_EVENT_NAME = "video_play_end";

class Base extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paused: this.props.isPaused || false,
      buffer: true
    };
    this.isUserPaused = false;
    this.pausedOnNavigation = false;
    this.minTimeConsideredForView = 1;
    this.source = {};
    this.currentPauseStatus = true; //Default value.

    this.videoContext = {
      userId: null,
      videoId: null,
      isMinimumViewed: false,
      isHalfViewed: false,
      isFullViewed: false,
      isUserVideoContextInSycn : function(currentUserId ,videoId ){
        if (this.userId != currentUserId) return false;
        if (this.videoId != videoId) return false;
        return true;
      },
      isEventCalledOnView: function (currentUserId, videoId) {
        if( !this.isUserVideoContextInSycn( currentUserId , videoId ) ) return false;
        return this.isMinimumViewed;
      },
      isEventCalledOnHalfViewed : function(currentUserId, videoId){
        if( !this.isUserVideoContextInSycn( currentUserId , videoId ) ) return false;
        return this.isHalfViewed ;
      },
      isEventCalledOnFullViewed : function(currentUserId, videoId , ignoreLocal=false){
        if( !this.isUserVideoContextInSycn( currentUserId , videoId ) ) return false;
        if(ignoreLocal){
          return false;
        }
        return this.isFullViewed ;
      },
      syncUserVideo( userId, videoId ){
        this.userId = userId;
        this.videoId = videoId;
      },
      eventFired: function (userId, videoId) {
        this.syncUserVideo(userId, videoId);
        this.isMinimumViewed = true;
      },
      eventFiredHalfView: function(userId, videoId){
        this.syncUserVideo(userId, videoId);
        this.isHalfViewed = true;
      },
      eventFiredFullView: function(userId, videoId){
        this.syncUserVideo(userId, videoId);
        this.isFullViewed = true;
      },
      resetState : function () {
        this.isMinimumViewed = false ;
        this.isHalfViewed =  false;
        this.isFullViewed = false;
      }
    };
  }

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener('didFocus', (payload) => {
      clearTimeout(this.loadingTimeOut);
      this.loadingTimeOut = setTimeout(() => {
        this.pausedOnNavigation = false;
        if (!this.isUserPaused) {
          this.playVideo();
        }
      }, 300);
    });

    this.willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) => {
      clearTimeout(this.loadingTimeOut);
      this.pausedOnNavigation = true;
      this.pauseVideo();
    });

    this._handleAppStateChange = (nextAppState) => {
      clearTimeout(this.activeStateTimeout);
      this.activeStateTimeout = setTimeout(() => {
        this.appActiveStateChanged(nextAppState);
      }, 100);
    };

    AppState.addEventListener('change', this._handleAppStateChange);
    VideoPlayPauseEmitter.on('play', this.onSdkPlay);
    VideoPlayPauseEmitter.on('pause', this.onSdkPause);
    if(this.props.dataChangeEvent){
      this.props.dataChangeEvent.on('refreshDone' , this.onDataRefresh );
    }

  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
    this.willBlurSubscription.remove();
    if (this._handleAppStateChange) {
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
    clearTimeout(this.loadingTimeOut);
    clearTimeout(this.activeStateTimeout);
    if(this.props.dataChangeEvent) {
      this.props.dataChangeEvent.removeListener('refreshDone', this.onDataRefresh, this);
    }
    VideoPlayPauseEmitter.removeListener('play' , this.onSdkPlay ,  this);
    VideoPlayPauseEmitter.removeListener('pause' , this.onSdkPause ,  this);
    this.pauseVideo = () => {};
    this.playVideo = () => {};
    this.onLoad = () => {};
  }

  onSdkPause = () => {
    if(this.props.isActive){
      this.pauseVideo(true);
    }
  };

  onSdkPlay = () => {
    if (!this.isUserPaused ) {
      this.playVideo();
    }
  };

  onDataRefresh = () => {
    this.videoContext.resetState();
  };

  shouldPlay(){
   return AppState.currentState == AppConfig.appStateMap.active && this.props.shouldPlay() ;
  }

  isPaused() {
    return this.state.buffer || !this.props.isActive || this.state.paused || this.props.loginPopover || !this.shouldPlay();
  }

  playVideo() {
    if (this.props.isActive && this.state.paused) {
      this.setState({ paused: false });
      return;
    }
    if ( this.isPaused() != this.currentPauseStatus ) {
      //Force render.
      this.forceUpdate();
    }
  }

  pauseVideo(isUserPaused) {
    this.setState({ paused: true });
    if (isUserPaused !== undefined) {
      this.isUserPaused = isUserPaused;
    }
  }

  componentDidUpdate() {
    if (!this.props.isActive && this.state.paused) {
      this.state.paused = false;
    }
  }

  appActiveStateChanged(nextAppState) {
    let appState = nextAppState.toLowerCase();
    if (AppConfig.appStateMap.active === appState && !this.isUserPaused && !this.pausedOnNavigation) {
      this.playVideo();
    } else if ( AppConfig.appStateMap.inactive === appState || AppConfig.appStateMap.background === appState ) {
      this.pauseVideo();
    }
  }

  onPausePlayBtnClicked = () => {
    if (this.state.paused) {
      this.isUserPaused = false;
      this.playVideo();
    } else {
      this.pauseVideo(true);
    }
  };

  onLoad = (params) => {
    if (this.state.buffer) {
      this.setState({ buffer: false });
    }
    if (this.minTimeConsideredForView > params.duration) this.minTimeConsideredForView = params.duration;
  };

  onProgress = (params) => {
    if(this.isMinimumVideoViewed(params) && !this.videoContext.isEventCalledOnView(CurrentUser.getUserId(), this.props.videoId)){
      this.fireEvent(params);
      this.props.onMinimumVideoViewed && this.props.onMinimumVideoViewed();
    }

    if(this.isVideoHalfViewed(params)){
      this.onVideoHalfViewed( params );
    }
  };

  fireEvent(params) {
    const parentData =  this.props.getPixelDropData() ;
    let pixelParams = {  e_action: 'view' };
    pixelParams = assignIn({}, pixelParams, parentData);
    PixelCall(pixelParams);
    this.sendFeedVideoEvent(VIDEO_PLAY_START_EVENT_NAME);
    this.videoContext.eventFired(CurrentUser.getUserId(), this.props.videoId);
  }

  isMinimumVideoViewed =( params ={}) => {
    return params.currentTime >= this.minTimeConsideredForView;
  }

  isVideoHalfViewed = (params ={} ) => {
    if(!this.isMinimumVideoViewed(params)) return false;
    const currentTime = params.currentTime,
          totalTime = params.seekableDuration,
          halfDuration = totalTime && totalTime/2;
    return halfDuration && currentTime >= halfDuration;
  }

  sendFeedVideoEvent(eventKind) {
    let feedId = 0; // For non-feed video elements.
    if (this.props.feedId) {
      feedId = this.props.feedId;
    }

    let data = {
      kind: eventKind,
      payload: {feed_id: feedId, video_id: this.props.videoId}
    };
    socketPixelCall.fireEvent(data);
  }

  onEnd = (params) => {
    if ( this.videoContext.isEventCalledOnFullViewed(CurrentUser.getUserId() , this.props.videoId ) ) return;
    this.sendFeedVideoEvent(VIDEO_PLAY_END_EVENT_NAME);
    const parentData =  this.props.getPixelDropData() ;
    let pixelParams = {   e_action: 'full_viewed' };
    pixelParams = assignIn({}, pixelParams, parentData);
    PixelCall(pixelParams);
    this.videoContext.eventFiredFullView(CurrentUser.getUserId(), this.props.videoId);
  };

  onVideoHalfViewed =( ) => {
    if (this.videoContext.isEventCalledOnHalfViewed(CurrentUser.getUserId(), this.props.videoId)) return;
    const parentData =  this.props.getPixelDropData() ;
    let pixelParams = {   e_action: 'half_viewed', };
    pixelParams = assignIn({}, pixelParams, parentData);
    PixelCall(pixelParams);
    this.videoContext.eventFiredHalfView(CurrentUser.getUserId(), this.props.videoId)
  }

  getIsVideoPausedStatus = () => {
    //NOTE: NEVER CALL THIS METHOD FROM ANYWHERE ELSE>
    //CALLED from paused prop of video.
    this.currentPauseStatus = this.isPaused();
    return this.currentPauseStatus;
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onPausePlayBtnClicked}>
        <View>
          {this.props.doRender && this.props.videoUrl && (
            <Video
              poster={this.props.videoImgUrl}
              posterResizeMode={this.props.posterResizeMode || 'cover'}
              style={[inlineStyles.fullHeightWidthSkipFont, this.props.style]}
              paused={this.getIsVideoPausedStatus()}
              resizeMode={this.props.resizeMode || 'cover'}
              source={{ uri: this.props.videoUrl }}
              repeat={this.props.repeat || true}
              onLoad={this.onLoad}
              ignoreSilentSwitch={'ignore'}
              onProgress={this.onProgress}
              onEnd={this.onEnd}
            />
          )}
          {this.state.buffer && <ActivityIndicator style={inlineStyles.playIconSkipFont} />}
          {this.isPaused() && !this.state.buffer && this.isUserPaused && (
            <Image style={inlineStyles.playIconSkipFont} source={playIcon}></Image>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

Base.defaultProps = {
  shouldPlay: function(){
    return true;
  },
  getPixelDropData: function(){
    console.warn("getPixelDropData props is mandatory for Video component");
    return {};
  },
  doRender: true ,
  isActive: true
};

export default withNavigation(Base);
