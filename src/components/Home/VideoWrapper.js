import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback, AppState, View, Image, Dimensions, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Video from 'react-native-video';
import inlineStyles from './styles';
import reduxGetter from '../../services/ReduxGetters';
import playIcon from '../../assets/play_icon.png';
import CurrentUser from '../../models/CurrentUser';
import PixelCall from '../../services/PixelCall';

const mapStateToProps = (state, ownProps) => {
  return {
    videoImgUrl: reduxGetter.getVideoImgUrl(ownProps.videoId, state),
    videoUrl: reduxGetter.getVideoUrl(ownProps.videoId, state),
    //TODO: logic should not be decided on login popover--Ashutosh
    loginPopover: ownProps.isActive && state.login_popover.show
  };
};

class VideoWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paused: this.props.isPaused || false,
      buffer: true
    };
    this.isUserPaused = false;
    this.pausedOnNavigation = false;
    this.isPixelCalledOnView = false;
    this.isPixelCalledOnEnd = false;
    this.minTimeConsideredForView = 4;
    this.source = {};
  }

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener('didFocus', (payload) => {
      clearTimeout(this.loadingTimeOut);
      this.loadingTimeOut = setTimeout(() => {
        this.pausedOnNavigation = false;
        if (!this.isUserPaused && this.props.ignoreScroll == undefined) {
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

  isPaused() {
    return !this.props.isActive || this.state.paused || this.props.loginPopover;
  }

  playVideo() {
    if (this.props.isActive && this.state.paused) {
      this.setState({ paused: false });
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
    if ('active' === appState && !this.isUserPaused && !this.pausedOnNavigation) {
      this.playVideo();
    } else if ('inactive' === appState) {
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
    if (this.isPixelCalledOnView) return;
    if (params.currentTime >= this.minTimeConsideredForView) {
      this.callPixelService({ event_name: 'video_viewed' });
      this.isPixelCalledOnView = true;
    }
  };

  onEnd = (params) => {
    if (this.isPixelCalledOnEnd) return;
    this.callPixelService({ event_name: 'video_watched' });
    this.isPixelCalledOnEnd = true;
  };

  callPixelService(params) {
    // remove return while pixel implementation
    return;
    let paramsToSend = { ...{ user_id: CurrentUser.getUserId(), video_id: this.props.videoId }, ...params };
    let pixelCall = new PixelCall(paramsToSend);
    pixelCall.perform();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onPausePlayBtnClicked}>
        <View>
          {this.props.doRender && (
            <Video
              poster={this.props.videoImgUrl}
              posterResizeMode={this.props.posterResizeMode || 'cover'}
              style={[inlineStyles.fullHeightSkipFont, this.props.style]}
              paused={this.isPaused()}
              resizeMode={this.props.resizeMode || 'cover'}
              source={{ uri: this.props.videoUrl }}
              repeat={this.props.repeat || true}
              onLoad={this.onLoad}
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

export default connect(mapStateToProps)(withNavigation(VideoWrapper));
