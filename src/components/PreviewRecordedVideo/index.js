import React, { Component } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View, Image, BackHandler, AppState, Text } from 'react-native';
import Video from 'react-native-video';
import ProgressBar from 'react-native-progress/Bar';
import playIcon from '../../assets/preview_play_icon.png';
import tickIcon from '../../assets/tick_icon.png';
import Store from '../../store';
import { upsertRecordedVideo, videoInProcessing } from '../../actions';
import { ActionSheet } from 'native-base';
import styles from './styles';
import closeIcon from '../../assets/cross_icon.png';
import { withNavigation } from 'react-navigation';
import videoUploaderComponent from '../../services/CameraWorkerEventEmitter';
import TouchableButton from '../../theme/components/TouchableButton';
import Theme from '../../theme/styles';
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
    this.didFocus.remove();
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
    this.setState({
      progress: progress.currentTime / this.state.duration
    });
  };

  handleLoad = (meta) => {
    this.setState({
      duration: meta.duration
    });
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
        title: 'Discard Video?'
      },
      (buttonIndex) => {
        if (buttonIndex == ACTION_SHEET_RESHOOT_INDEX) {
          // This will take to VideoRecorder component
          Store.dispatch(
            upsertRecordedVideo({
              do_discard: true
            })
          );
          this.props.goToRecordScreen();
        } else if (buttonIndex == ACTION_SHEET_DESCTRUCTIVE_INDEX) {
          this.props.navigation.goBack(null);
          // videoUploaderComponent.emit('hide');
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

  render() {
    return (
      <View style={styles.container}>
        <Video
          source={{ uri: this.cachedVideoUri }}
          style={styles.previewVideoSkipFont}
          fullscreen={true}
          onLoad={this.handleLoad}
          onProgress={this.handleProgress}
          onEnd={this.handleEnd}
          ref={(component) => (this._video = component)}
          paused={this.pauseVideo}
        ></Video>
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

        <View style={styles.bottomControls}>
          {this.state.progress == 1 ? (
            <TouchableOpacity
              onPress={() => {
                this.replay();
              }}
            >
              <Image style={styles.playIconSkipFont} source={playIcon} />
            </TouchableOpacity>
          ) : (
            <View style={styles.playIcon} />
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: 20 }}>
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
    );
  }

  replay() {
    this.setState({ progress: 0 });
    this._video && this._video.seek(0);
  }
}

//make this component available to the app
export default withNavigation(PreviewRecordedVideo);
