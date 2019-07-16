import React, { Component } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View, Image, Text } from 'react-native';
import Video from 'react-native-video';
import ProgressBar from 'react-native-progress/Bar';
import playIcon from '../../assets/play_icon.png';
import tickIcon from '../../assets/tick_icon.png';
import Store from '../../store';
import { upsertRecordedVideo } from '../../actions';
import { ActionSheet } from 'native-base';
import styles from './styles';

const PROGRESS_FACTOR = 0.01;

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
    Store.dispatch(upsertRecordedVideo({raw_video: this.cachedVideoUri}));
  }

  enableStartUploadFlag(){
    Store.dispatch(upsertRecordedVideo({do_upload: true}));
  }

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

  handleEnd() {
    this.setState({
      progress: 1
    });
  }

  cancleVideoHandling() {
    ActionSheet.show(
        {
          options: ACTION_SHEET_BUTTONS,
          cancelButtonIndex: ACTION_SHEET_CANCEL_INDEX,
          destructiveButtonIndex: ACTION_SHEET_DESCTRUCTIVE_INDEX
        },
        (buttonIndex) => {
          console.log('This is Button index', buttonIndex);
          if (buttonIndex == ACTION_SHEET_RESHOOT_INDEX) {
            // This will take to VideoRecorder component
            this.props.toggleView();
          } else if (buttonIndex == ACTION_SHEET_DESCTRUCTIVE_INDEX) {
            //navigate to previous page
          }
        }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Video
          source={{ uri: this.cachedVideoUri }}
          style={styles.previewVideo}
          fullscreen={true}
          onLoad={(meta) => {
            this.handleLoad(meta);
          }}
          onProgress={(progress) => {
            this.handleProgress(progress);
          }}
          onEnd={() => {
            this.handleEnd();
          }}
          ref={(component) => (this._video = component)}
        ></Video>
        <ProgressBar
          width={null}
          color="#EF5566"
          progress={this.state.progress}
          indeterminate={false}
          style={styles.progressBar}
        />
        <TouchableWithoutFeedback onPressIn={this.cancleVideoHandling}>
          <View style={styles.cancelButton}>
            <Text style={styles.cancelText}>X</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.bottomControls}>
          <TouchableOpacity
            onPress={() => {
              this.replay();
            }}
          >
            <Image style={styles.playIcon} source={playIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              this.enableStartUploadFlag();
            }}
          >
            <Image style={styles.tickIcon} source={tickIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  replay() {
    this.setState({ progress: 0 });
    this._video && this._video.seek(0);
  }

  initProgressBar() {
    this.progressInterval = setInterval(() => {
      if (this.state.progress < 1) {
        this.setState({ progress: this.state.progress + PROGRESS_FACTOR });
      } else {
        this.stopRecording();
      }
    }, 300);
  }
}

//make this component available to the app
export default PreviewRecordedVideo;
