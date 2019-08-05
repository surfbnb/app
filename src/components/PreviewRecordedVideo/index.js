import React, { Component } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View, Image, Text, BackHandler, SafeAreaView, AppState } from 'react-native';
import Video from 'react-native-video';
import ProgressBar from 'react-native-progress/Bar';
import playIcon from '../../assets/preview_play_icon.png';
import tickIcon from '../../assets/tick_icon.png';
import Store from '../../store';
import { upsertRecordedVideo, videoInProcessing } from '../../actions';
import { ActionSheet } from 'native-base';
import styles from './styles';
import { withNavigationFocus } from 'react-navigation';
import closeIcon from '../../assets/cross_icon.png';

const ACTION_SHEET_BUTTONS = ['Reshoot', 'Close Camera', 'Cancel'];
const ACTION_SHEET_CANCEL_INDEX = 2;
const ACTION_SHEET_DESCTRUCTIVE_INDEX = 1;
const ACTION_SHEET_RESHOOT_INDEX = 0;

class PreviewRecordedVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };
    this.cachedVideoUri = this.props.cachedvideoUrl;
    this.cancleVideoHandling = this.cancleVideoHandling.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    AppState.addEventListener('change', this._handleAppStateChange);

    Store.dispatch(upsertRecordedVideo({ raw_video: this.cachedVideoUri }));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }


  _handleAppStateChange = (nextAppState) => {
    if (nextAppState == 'active' && this.state.progress == 1){
      this.replay();
    }
  };

  handleBackButtonClick = () => {
    if (this.props.isFocused) {
      this.cancleVideoHandling();
      return true;
    }
  };

  enableStartUploadFlag = () => {
    this.props.navigation.goBack();
    Store.dispatch(upsertRecordedVideo({ do_upload: true }));
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
        destructiveButtonIndex: ACTION_SHEET_DESCTRUCTIVE_INDEX
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
          Store.dispatch(
            upsertRecordedVideo({
              do_discard: true
            })
          );
          //TODO: navigate to previous page
          Store.dispatch(videoInProcessing(false));
          this.props.navigation.goBack();
        }
      }
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Video
            source={{ uri: this.cachedVideoUri }}
            style={styles.previewVideoSkipFont}
            fullscreen={true}
            onLoad={this.handleLoad}
            onProgress={this.handleProgress}
            onEnd={this.handleEnd}
            ref={(component) => (this._video = component)}
          ></Video>
          <ProgressBar
            width={null}
            color="#EF5566"
            progress={this.state.progress}
            indeterminate={false}
            style={styles.progressBar}
          />        
          <TouchableWithoutFeedback  onPressIn={this.cancleVideoHandling}>
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

            <TouchableOpacity onPress={this.enableStartUploadFlag}>
              <Image style={styles.tickIconSkipFont} source={tickIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  replay() {
    this.setState({ progress: 0 });
    this._video && this._video.seek(0);
  }
}

//make this component available to the app
export default withNavigationFocus(PreviewRecordedVideo);
