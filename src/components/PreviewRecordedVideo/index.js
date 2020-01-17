import React, { Component } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View, Image, BackHandler, AppState, Text } from 'react-native';
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
    this.videoUrlsList = this.props.videoUrlsList;
    this.state = {
      progress: 0,
      currentActiveComponent: 'video-component-0'
    };

    this.indexOfVideo = 0;
    this.nextUrlComponentZero = this.videoUrlsList[0] || {};
    this.nextUrlComponentOne = {};
    this.completedVideosDuration = 0;
    this.currentVideoDuration = 0;
    this.pauseVideo = false;

    this.totalVideoLength = this.props.totalVideoLength;
    // this.nextUrlComponentZero = this.videoUrlsList[0];
    this.cancleVideoHandling = this.cancleVideoHandling.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    AppState.addEventListener('change', this._handleAppStateChange);

    Store.dispatch(upsertRecordedVideo({ raw_video_list: this.videoUrlsList, video_length: this.totalVideoLength }));
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
    console.log(this.completedVideosDuration, 'this.completedVideosDuration');
    console.log(  progress.currentTime, 'progress.currentTime');
    console.log(this.totalVideoLength, 'totalVideoLength');
    let totalProgress = (this.completedVideosDuration / 1000) + progress.currentTime;
    this.setState({
      progress: totalProgress / (this.totalVideoLength/1000)
    });
  };

  handleEnd = () => {
    console.log('handleEnd-------====-------',
      this.videoUrlsList,
      this.videoUrlsList[this.indexOfVideo].progress * 100 * 300);
    this.completedVideosDuration += this.currentVideoDuration;
    this.currentVideoDuration = this.videoUrlsList[this.indexOfVideo].progress * 100 * 300;

    if (this.videoUrlsList.length - 1 === this.indexOfVideo ){
      this.setState({ progress: 1 });
      if(this.videoUrlsList.length === 1 ){
        this.indexOfVideo = 1;
        // This is hack to replay single video\.
      }
    } else {
      this.indexOfVideo = this.indexOfVideo + 1;
      // this.setState({indexOfVideo:  this.state.indexOfVideo + 1});
      setTimeout(()=>{this.setState(
        {
          currentActiveComponent: this.state.currentActiveComponent  === 'video-component-1'
            ? 'video-component-0':
            'video-component-1'
        })}, 1)

    }

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

  showVideoComp = () => {
    const isShowingComponent1 = this.state.currentActiveComponent === 'video-component-0';
    const isShowingComponent2 = !isShowingComponent1;
    console.log(isShowingComponent1, 'isShowingComponent1');
    console.log(isShowingComponent2, 'isShowingComponent2');
    console.log( this.nextUrlComponentOne, this.nextUrlComponentZero, '===++++=====++++====+====+=+=+==');

      return <View style={{flex: 1}}>
        <Video
          source={{uri: this.nextUrlComponentZero.uri || 'INVALID'}}
          style={{
            position:"absolute",
            top:0,
            left:0,
            width:"100%",
            height: "100%",
            flex: (isShowingComponent1 ? 1 : 0)
          }}
          posterResizeMode={'cover'}
          resizeMode={'cover'}
          onProgress={this.handleProgress}
          onEnd={this.handleEndZero}
          ref={(component) => {
            // if (this.state.indexOfVideo == 0) {
            //   this._video = component
            // }
          }}
          paused={isShowingComponent1 ? this.pauseVideo : true}
        />
        <Video
          source={{ uri: this.nextUrlComponentOne.uri || 'INVALID' }}
          style={{
            flex: isShowingComponent2 ? 1 : 0
          }}
          posterResizeMode={'cover'}
          resizeMode={'cover'}
          onProgress={this.handleProgress}
          onEnd={this.handleEndOne}
          // ref={(component) =>   { if(this.indexOfVideo == 0){ this._video = component } }}
          paused={isShowingComponent2 ? this.pauseVideo : true}
        />
      </View>
  };


  handleEndOne = () => {
    console.log('handleEndOne', this.indexOfVideo );
    this.nextUrlComponentZero =  this.getNextVideoUri();
    // this.setState ({nextUrlComponentOne : this.videoUrlsList[this.state.indexOfVideo + 1]});
    this.handleEnd();


  };

  handleEndZero = () => {
    console.log('handleEndZero', this.indexOfVideo );
    this.nextUrlComponentOne = this.getNextVideoUri();
    // this.setState ({nextUrlComponentOne : this.videoUrlsList[this.state.indexOfVideo + 1]});
    this.handleEnd();
  };

  getNextVideoUri = () => {
    return this.videoUrlsList[this.indexOfVideo + 1] || {} ;
  };


  render() {
    return (
      <View style={styles.container}>
        {this.showVideoComp()}
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
    this.completedVideosDuration = 0;
    this.currentVideoDuration = 0;
    this.indexOfVideo  = 0;
    if (this.state.currentActiveComponent === 'video-component-0') {
      this.nextUrlComponentOne = this.videoUrlsList[this.indexOfVideo] || {};
      this.nextUrlComponentZero = {};
      this.setState( {
        progress: 0,
        currentActiveComponent:'video-component-1'
      });
    } else if (this.state.currentActiveComponent === 'video-component-1') {
      this.nextUrlComponentOne = {};
      this.nextUrlComponentZero = this.videoUrlsList[this.indexOfVideo] || {};
      this.setState( {
        progress: 0,
        currentActiveComponent:'video-component-0'
      });
    }
  }
}

//make this component available to the app
export default withNavigation(PreviewRecordedVideo);
