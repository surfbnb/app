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
    this.isPixelCalledOnEnd = false;
    this.minTimeConsideredForView = 1;
    this.source = {};
    this.currentPauseStatus = true; //Default value.

    this.videoContext = {
      userId: null,
      videoId: null,
      isEventCalledOnView: function (currentUserId, videoId) {
        if (this.userId != currentUserId) return false;

        if (this.videoId != videoId) return false;

        return true;
      },
      eventFired: function (userId, videoId) {
        this.userId = userId;
        this.videoId = videoId;
      },
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

    VideoPlayPauseEmitter.on('play', () => {
      if (!this.isUserPaused ) {
        this.playVideo();
      }
    });

    VideoPlayPauseEmitter.on('pause', () => {
      if(this.props.isActive){
        this.pauseVideo(true);
      }
    });
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
    this.willBlurSubscription.remove();
    if (this._handleAppStateChange) {
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
    clearTimeout(this.loadingTimeOut);
    clearTimeout(this.activeStateTimeout);
  }

  shouldPlay(){
   return AppState.currentState == AppConfig.appStateMap.active && this.props.shouldPlay() ;
  }

  isPaused() {
    return !this.props.isActive || this.state.paused || this.props.loginPopover || !this.shouldPlay();
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
    this.fireEvent(params);
  };

  fireEvent(params) {
    if (this.videoContext.isEventCalledOnView(CurrentUser.getUserId(), this.props.video_id)) return;
    if (params.currentTime >= this.minTimeConsideredForView) {
      let pixelParams = {
        e_entity: 'video',
        e_action: 'view',
        e_data_json: {
          video_id: this.props.videoId,
          profile_user_id: this.props.userId
        },
        p_type: this.props.navigation.state.routeName === 'HomeScreen' ? 'feed' : 'user_profile'
      };
      PixelCall(pixelParams);

      this.sendFeedVideoEvent(VIDEO_PLAY_START_EVENT_NAME);

      this.videoContext.eventFired(CurrentUser.getUserId(), this.props.video_id);
    }
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
    if (this.isPixelCalledOnEnd) return;
    let pixelParams = {
      e_entity: 'video',
      e_action: 'full_viewed',
      e_data_json: {
        video_id: this.props.videoId,
        profile_user_id: this.props.userId
      },
      p_type: this.props.navigation.state.routeName === 'HomeScreen' ? 'feed' : 'user_profile'
    };
    PixelCall(pixelParams);
    this.isPixelCalledOnEnd = true;

    this.sendFeedVideoEvent(VIDEO_PLAY_END_EVENT_NAME);
  };

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
  doRender: true ,
  isActive: true
};

export default withNavigation(Base);
