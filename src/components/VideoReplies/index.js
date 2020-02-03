import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Animated ,TouchableWithoutFeedback
} from 'react-native';

import {getBottomSpace, getStatusBarHeight, ifIphoneX, isIphoneX} from 'react-native-iphone-x-helper';

import inlineStyles from './styles';
import crossIcon from '../../assets/cross_icon.png';
import ReplyCollection from '../ReplyCollection';
import NavigationService from "../../services/NavigationService";
import utilities from "../../services/Utilities";

import SlidingUpPanel from "../CommonComponents/SlidingUpPanel";
import VideoLoadingFlyer from '../CommonComponents/VideoLoadingFlyer';
import videoUploaderComponent from '../../services/CameraWorkerEventEmitter';

import DataContract from '../../constants/DataContract';
import ReduxGetters from '../../services/ReduxGetters';
import {getVideoReplyObject, replyPreValidationAndMessage} from "../../helpers/cameraHelper";
import VideoReplyIcon from '../../assets/reply_video_icon.png';
import VideoReplyCount from '../../components/CommonComponents/VideoReplyCount';
import {hasNotch} from "../../helpers/NotchHelper";

const statusBarHeight = StatusBar.currentHeight || 0;
const { width, height } = Dimensions.get('window');

const topPadding = getStatusBarHeight(true);
const bottomPadding = getBottomSpace();
const bottomReplyViewHeight = isIphoneX() ? 88 : Platform.OS === 'ios' ? 54 : hasNotch() ? 54 - statusBarHeight : 54 - statusBarHeight;
const listBottomPadding = height - (height/1.5)+bottomReplyViewHeight ;

class VideoRepliesScreen extends PureComponent {

    static navigationOptions = ({ navigation, navigationOptions }) => {
      return {
        header: null,
        headerBackTitle: null,
        gesturesEnabled: false
      };
    };

    constructor(props){
      super(props);
        this.userId = props.navigation.getParam('userId');
        this.videoId = props.navigation.getParam('videoId');
        this.fetchUrl = DataContract.replies.getReplyListApi(this.videoId);
        this.initialHeight =  height/1.5;
        this.animatedValue = new Animated.Value(this.initialHeight) ;
        this.listener = null;
        this.panelAnimateTimeOut = 0 ;


      this.state = {
        showBackdrop : false,
        addRepliesVisible : true,
        videoUploaderVisible: false,
        currentHeight : this.initialHeight
      }
    }

    componentDidMount(){
      this.listener = this.animatedValue.addListener(this.onAnimatedValueChange);
      setTimeout(()=> {
        this.setState({
          showBackdrop: true,
          videoUploaderVisible: ReduxGetters.getVideoProcessingStatus()
        });

      }, 300)
      videoUploaderComponent.on('show', this.showVideoUploader);
      videoUploaderComponent.on('hide', this.hideVideoUploader);
    }

    componentWillUnmount() {
      this.onAnimatedValueChange= () => {};
      this.showVideoUploader = () => {};
      this.hideVideoUploader = () => {};
      this.onMomentumDragEndCallback = () => {};
      this.animatedValue.removeListener(this.listener);
      videoUploaderComponent.removeListener('show' , this.showVideoUploader , this);
      videoUploaderComponent.removeListener('hide' , this.hideVideoUploader , this);
    }

    showVideoUploader = () => {
      this.setState({
        videoUploaderVisible: true
      });
    };

    hideVideoUploader = ( otherStates, callback ) => {
      otherStates = otherStates || {};
      this.setState({
        ...otherStates,
        videoUploaderVisible: false
      }, callback);
    };

    onAnimatedValueChange = ({ value }) => {
      clearTimeout(this.panelAnimateTimeOut);
      this.panelAnimateTimeOut =  setTimeout(()=> {
        if( value < 10){
          this.hideVideoUploader({
            addRepliesVisible: false
          },() => {
            this.props.navigation.goBack();
          });
        }
      } , 10)
    };

    onCrossIconClick = () => {
      this._panel.hide();
    };

  getUploadingText = () => {
    let videoType = ReduxGetters.getRecordedVideoType();
    if (videoType === 'post'){
      return "Uploading Video";
    } else if (videoType === DataContract.knownEntityTypes.reply){
      return "Posting reply";
    }
  }
  ;

    openCamera = () => {
      if( replyPreValidationAndMessage( this.videoId , this.userId ) ){
        let activeTab = NavigationService.getActiveTab();
        let params =  getVideoReplyObject ( this.videoId , this.userId) ;
        utilities.handleVideoUploadModal(activeTab, this.props.navigation, params);
      }
    }

    onData = ( data ) => {
        this.dataLoaded = true;
    }

    getWrapViewStyles = () => {
      let wrapStyles = {};
      if ( !this.state.addRepliesVisible ) {
        wrapStyles.display = "none";
      }
      return wrapStyles;
    };

    onMomentumDragEndCallback = (value) => {
      this.setState({
        currentHeight : value
      })
    }

    render(){
        return (
          <React.Fragment>
            {this.userId && this.state.videoUploaderVisible && (
                <VideoLoadingFlyer
                  componentHeight={46}
                  componentWidth={46}
                  sliderWidth={170}
                  containerStyle={{
                    ...ifIphoneX(
                      {
                        top: 60
                      },
                      {
                        top: 30
                      }
                    ),
                    left: 10,
                    zIndex: 9
                  }}
                  displayText={this.getUploadingText()}
                  extendDirection="right"
                  extend={true}
                  id={3}
                />
              )}
              <SlidingUpPanel ref={c => (this._panel = c)}
                  containerStyle={{zIndex: 99}}
                  animatedValue={this.animatedValue}
                  onMomentumDragEnd={this.onMomentumDragEndCallback}
                  ref={c => (this._panel = c)}
                  draggableRange={{
                    top: height - topPadding,
                    bottom: 0
                  }}
                  showBackdrop={this.state.showBackdrop}
                  snappingPoints={[0, this.initialHeight, height]}>
                {dragHandler => (
                  <React.Fragment>
                    <View style={[inlineStyles.container, this.getWrapViewStyles()]}>
                      <View style={inlineStyles.dragHandler} {...dragHandler}>
                        <TouchableOpacity onPress={this.onCrossIconClick} style={[inlineStyles.iconWrapper]} >
                          <Image style={inlineStyles.iconSkipFont} source={crossIcon}></Image>
                        </TouchableOpacity>

                        <View style={inlineStyles.repliesTxt}>
                          <VideoReplyCount videoId={this.videoId} showReplyText={true} style={inlineStyles.headerText} />
                        </View>
                      </View>
                      <ReplyCollection  userId={this.userId}  videoId={this.videoId} fetchUrl={this.fetchUrl}
                                        onData={this.onData}
                                        listBottomPadding={this.state.currentHeight > this.initialHeight?  topPadding+bottomPadding+bottomReplyViewHeight - (isIphoneX()? 34 : 0): listBottomPadding}
                                        onRefresh={this.onRefresh}
                      />
                    </View>
                  </React.Fragment>

                )}
              </SlidingUpPanel>
              {this.state.addRepliesVisible && (
                 <TouchableWithoutFeedback onPress={this.openCamera}>
                  <View style={inlineStyles.addReplyView}>
                    <View style={inlineStyles.addReplyInnerView}>
                      <Image source={VideoReplyIcon} style={inlineStyles.addReplyImageDimensionSkipFont}></Image>
                      <Text style={inlineStyles.addReplyText}>
                        Add a reply...
                      </Text>
                    </View>
                  </View>
               </TouchableWithoutFeedback>
              )}
          </React.Fragment>
        );
    }

}


export default VideoRepliesScreen;


