import React, { Component } from 'react';
import { TouchableOpacity, View, Image, BackHandler, AppState, Text } from 'react-native';
import Video from 'react-native-video';
import ProgressBar from 'react-native-progress/Bar';
import playIcon from '../../assets/preview_play_icon.png';
import Store from '../../store';
import { upsertRecordedVideo, videoInProcessing } from '../../actions';
import { ActionSheet } from 'native-base';
import styles from './styles';
import closeIcon from '../../assets/camera-cross-icon.png';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import multipleClickHandler from '../../services/MultipleClickHandler';

const ACTION_SHEET_BUTTONS = ['Reshoot', 'Discard', 'Cancel'];
const ACTION_SHEET_CANCEL_INDEX = 2;
const ACTION_SHEET_DESCTRUCTIVE_INDEX = 1;
const ACTION_SHEET_RESHOOT_INDEX = 0;

class PreviewRecordedVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };
    this.currentTime = 0;
    this.pauseVideo = false;
    this.cachedVideoUri = this.props.cachedvideoUrl;
    this.cancleVideoHandling = this.cancleVideoHandling.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    AppState.addEventListener('change', this._handleAppStateChange);

    Store.dispatch(upsertRecordedVideo({ raw_video: this.cachedVideoUri }));
    this.didFocus = this.props.navigation.addListener('didFocus', (payload) => {
      if (this.pauseVideo) {
        this.pauseVideo = false;
        this.replay();
      }
    });
    this.willBlur = this.props.navigation.addListener('willBlur', (payload) => {
      this.pauseVideo = true;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.didFocus && this.didFocus.remove && this.didFocus.remove();
    this.willBlur.remove();
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState == 'active' && this.state.progress == 1) {
      this.replay();
    }
  };

  handleBackButtonClick = () => {
    if (this.props.navigation.isFocused()) {
      this.cancleVideoHandling();
      return true;
    }
  };

  handleProgress = (progress) => {
    this.currentTime = progress.currentTime;
    this.setState({
      progress: progress.currentTime / this.state.duration
    });
  };

  handleLoad = (meta) => {
    this.setState({
      duration: meta.duration
    });
    Store.dispatch(upsertRecordedVideo({ video_length : meta.duration }));
  };

  handleEnd = () => {
    this.setState({
      progress: 1
    });
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
    const playRate = args && args.playbackRate;

    /*
    * PlayRate is zero that means its video start or paused in between.
    * this.state.progress > 0  that means video hard started playing
    * !this.pauseVideo that means video is expedted to play
    * The below condition says that video was accidentally paused as playRate = 0 , but pauseVideo is false and video had progress. 
    * */
    if (playRate == 0 && this.state.progress > 0 && !this.pauseVideo ){
      this._video && this._video.seek(this.currentTime);

    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Video
          source={{ uri: this.cachedVideoUri }}
          style={{
            flex:1
          }}
          onPlaybackRateChange={this.onPlaybackRateChange}
          posterResizeMode={'cover'}
          resizeMode={'cover'}
          onLoad={this.handleLoad}
          onProgress={this.handleProgress}
          onEnd={this.handleEnd}
          ref={(component) => (this._video = component)}
          paused={this.pauseVideo}
        />
        <ProgressBar
          width={null}
          color="#EF5566"
          progress={this.state.progress}
          indeterminate={false}
          style={styles.progressBar}
        />
        <TouchableOpacity onPressIn={this.cancleVideoHandling} style={styles.closeBtWrapper}>
          <Image style={styles.closeIconSkipFont} source={closeIcon}></Image>
        </TouchableOpacity>

        <View style={styles.bottomControls}>
          <View style={{flex :1}}></View>
          <View style={{flex :1, alignItems: 'center', justifyContent: 'center'}}>
            {this.state.progress == 1 ? (
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
                      this.props.goToDetailsScreen();
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

  replay() {
    this.setState({ progress: 0 });
    this._video && this._video.seek(0);
  }
}

//make this component available to the app
export default withNavigation(PreviewRecordedVideo);
