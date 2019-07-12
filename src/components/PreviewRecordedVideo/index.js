import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import Video from 'react-native-video';
import ProgressBar from 'react-native-progress/Bar';
import playIcon from '../../assets/play_icon.png';
import tickIcon from '../../assets/tick_icon.png';
import UploadToS3 from '../../services/UploadToS3';

const PROGRESS_FACTOR = 0.01;

class PreviewRecordedVideo extends Component {
  // static navigationOptions = {
  //   header: null
  // };
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };
    this.cachedVideoUri = this.props.navigation.getParam('videoUrl');

  }
  previewOnProgress(params) {
    console.log('paramsssss', params);
    this.setState({ progress: params.currentTime / params.seekableDuration });
  }

  uploadToS3() {
    let uploadToS3 = new UploadToS3({file: { uri: this.cachedVideoUri,
        type: "video/mp4",
        name: "video.mp4"},  fileType: 'video' });
        uploadToS3.perform();
  }

  render() {
    console.log(this.cachedVideoUri, "this.props.navigation.getParam('videoUrl')");
    return (
      <View style={styles.container}>
        <Video
          source={{ uri: this.cachedVideoUri }}
          style={styles.previewVideo}
          fullscreen={true}
          onProgress={(params) => {
            this.previewOnProgress(params);
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
        <View style={styles.bottomControls}>
          <TouchableOpacity
            onPress={() => {
              this.replay();
            }}
          >
            <Image style={styles.playIcon} source={playIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.uploadToS3();
            }}
          >
            <Image style={styles.tickIcon} source={tickIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  replay() {
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

  // stopRecording = () => {
  //   this.isRecording = false;
  //   clearInterval(this.progressInterval);
  //   this.camera && this.camera.stopRecording();
  // };

  navigateToViewRecording = (data) => {
    if (this.state.focusedScreen && data) {
      console.log(data.uri);
      this.props.navigation.navigate('ViewRecording', {
        uri: data.uri
        //thumbnail: result.path
      });
      // RNThumbnail.get(data.uri)
      //   .then(result => {
      //     console.log(result.path); // thumbnail path
      //     console.log("I am hereee in RNThumbnail");
      //     this.props.navigation.navigate("ViewRecording", {
      //       uri: data.uri,
      //       thumbnail: result.path
      //     });
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    alignSelf: 'stretch'
  },
  previewVideo: {
    // flex: 1,
    // justifyContent: "space-between",
    // alignItems: "center",
    // paddingVertical: 35

    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  playIcon: {
    width: 65,
    height: 65,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center'
    // margin: 20
  },
  tickIcon: {
    width: 45,
    height: 45,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'flex-end'
  },
  progressBar: {
    position: 'absolute',
    top: 40,
    borderRadius: 3.5,
    borderColor: '#fff',
    borderWidth: 0.5,
    height: 7,
    width: '90%',
    marginLeft: 10,
    marginRight: 10
  },
  bottomControls: {
    flex: 1,
    position: 'absolute',
    bottom: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%'
  }
});

//make this component available to the app
export default PreviewRecordedVideo;
