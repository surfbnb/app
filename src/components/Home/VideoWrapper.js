import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback, AppState, View, Image, Dimensions, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Video from 'react-native-video';
import inlineStyles from './styles';
import reduxGetter from '../../services/ReduxGetters';
import playIcon from '../../assets/play_icon.png';

const mapStateToProps = (state, ownProps) => {
  return {
    videoImgUrl: reduxGetter.getVideoImgUrl(ownProps.videoId, state),
    videoUrl: reduxGetter.getVideoUrl(ownProps.videoId, state),
    loginPopover: ownProps.isActive && state.login_popover.show
  };
};

class VideoWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paused: this.props.isPaused || false
    };
    this.isUserPaused = false;
    this.pausedOnNavigation = false;
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

  onBuffer = () =>{
    console.log(" in buffer")
    this.setState({buffer:true});
  }

  onLoadComplete = () =>{
    console.log("in onLoadComplete")
    this.setState({buffer:false});
  }

  render() {
    console.log("Video Render");
    return  (
      <TouchableWithoutFeedback onPress={this.onPausePlayBtnClicked}>
        <View>
          <Video
            poster={this.props.videoImgUrl}
            posterResizeMode={this.props.posterResizeMode || 'cover'}
            style={[inlineStyles.fullHeightSkipFont, this.props.style]}
            paused={this.isPaused()}
            resizeMode={this.props.resizeMode || 'cover'}
            source={{ uri: this.props.videoUrl }}
            repeat={this.props.repeat || true}
            onBuffer={this.onBuffer}
            onLoad={this.onLoadComplete}
          />
          {this.state.buffer && <ActivityIndicator style={inlineStyles.playIconSkipFont}/>}
          {this.isPaused() && !this.state.buffer && <Image style={inlineStyles.playIconSkipFont} source={playIcon}></Image>}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(VideoWrapper));
