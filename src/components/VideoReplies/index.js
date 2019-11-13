import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated
} from "react-native";
import { ifIphoneX } from 'react-native-iphone-x-helper';

import plusIcon from '../../assets/user-video-capture-icon-selected.png';
import pepoIcon from "../../assets/pepo-tx-icon.png";
import inlineStyles from './styles';
import crossIcon from '../../assets/cross_icon.png';
import ReplyCollection from '../ReplyCollection';
import NavigationService from "../../services/NavigationService";
import utilities from "../../services/Utilities";

import SlidingUpPanel from "../CommonComponents/SlidingUpPanel";
import VideoLoadingFlyer from '../CommonComponents/VideoLoadingFlyer';
import videoUploaderComponent from '../../services/CameraWorkerEventEmitter';

import { getInset } from 'react-native-safe-area-view';
import DataContract from '../../constants/DataContract';
import ReduxGetters from '../../services/ReduxGetters';
const { width, height } = Dimensions.get('window');
const landScape = width > height;
const topPadding = getInset('top', landScape);
const bottomPadding = getInset('bottom', landScape);
const finalPadding = topPadding - bottomPadding;
const listBottomPadding = height - (height/1.5);

class VideoRepliesScreen extends PureComponent {

    static navigationOptions = ({ navigation, navigationOptions }) => {
      return {
        header: null,
        headerBackTitle: null
      };
    };

    constructor(props){
      super(props);
        this.userId = props.navigation.getParam('userId');
        this.videoId = props.navigation.getParam('videoId');
        this.amount = ReduxGetters.getVideoReplyAmount(this.videoId );
        this.videoReplyCount = ReduxGetters.getVideoReplyCount(this.videoId);

        this.fetchUrl = DataContract.replies.getReplyListApi(this.videoId);
        this.initialHeight =  height/1.5;
        this.animatedValue = new Animated.Value(this.initialHeight) ;
        this.listener = null;
        this.panelAnimateTimeOut = 0 ;


      this.state = {
        showBackdrop : false,
        videoUploaderVisible: false,
        videoUploaderText: 'Posting reply',
        currentHeight : this.initialHeight
      }
    }

    componentDidMount(){
      this.listener = this.animatedValue.addListener(this.onAnimatedValueChange);
      setTimeout(()=> {
        this.setState({
          showBackdrop: true,
          videoUploaderVisible: ReduxGetters.getVideoProcessingStatus() // find from redux @mayur
        });

      }, 300)
      videoUploaderComponent.on('show', this.showVideoUploader);
      videoUploaderComponent.on('hide', this.hideVideoUploader);
    }

    componentWillUnmount() {
      this.onAnimatedValueChange= () => {};
      this.animatedValue.removeListener(this.listener);
      videoUploaderComponent.removeListener('show');
      videoUploaderComponent.removeListener('hide');
    }

    showVideoUploader = () => {
      this.setState({
        videoUploaderVisible: true
      });
    };
  
    hideVideoUploader = () => {
      this.setState({
        videoUploaderVisible: false
      });
    };

    onAnimatedValueChange = ({ value }) => {
      clearTimeout(this.panelAnimateTimeOut);
      this.panelAnimateTimeOut =  setTimeout(()=> {
        if( value < 10){
          this.hideVideoUploader();
          this.props.navigation.goBack();
        }
      } , 10)
    }

    onCrossIconClick = () => {
      this._panel.hide();
    }

    openCamera = () => {
      let activeTab = NavigationService.getActiveTab();
      //TODO @mayur move it to a function , If possible change this to string 
      let params = {
          videoTypeReply: true,
          videoId: this.videoId,
          userId: this.userId,
          amount: this.amount,
          videoReplyCount: this.videoReplyCount
      };
      utilities.handleVideoUploadModal(activeTab, this.props.navigation, params);
    }

    onData = ( data ) => {
        this.dataLoaded = true;
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
                  displayText={this.state.videoUploaderText}
                  extendDirection="right"
                  extend={true}
                  id={3}
                />
              )}
              <SlidingUpPanel ref={c => (this._panel = c)}
                  containerStyle={{zIndex: 99}}
                  animatedValue={this.animatedValue}
                  onMomentumDragEnd={(value) => {
                    this.setState({
                      currentHeight : value
                    })

                  }}
                  ref={c => (this._panel = c)}
                  draggableRange={{
                    top: height - finalPadding, //TODO check is top expand
                    bottom: 0
                  }}
                  showBackdrop={this.state.showBackdrop}
                  snappingPoints={[0, this.initialHeight, height]}>
                {dragHandler => (
                  <React.Fragment>
                    <View style={[inlineStyles.container]}>
                      <View style={inlineStyles.dragHandler} {...dragHandler}>
                        <TouchableOpacity onPress={this.onCrossIconClick} style={[inlineStyles.iconWrapper]} >
                          <Image style={inlineStyles.iconSkipFont} source={crossIcon}></Image>
                        </TouchableOpacity>

                        <View style={inlineStyles.repliesTxt}>
                          <Text numberOfLines={1} style={inlineStyles.headerText}>
                            Replies to {this.userName}
                          </Text>
                          {/* {TODO integration pending} */}
                          <Text style={inlineStyles.headerSubText}>Send a reply with{' '}
                          <Image style={{height: 10, width: 10}} source={pepoIcon} />
                          {this.amount}</Text>
                        </View>

                        <TouchableOpacity onPress={this.openCamera} style={inlineStyles.iconWrapper} >
                          <Image style={[inlineStyles.iconSkipFont, {height: 25, width: 25}]} source={plusIcon} />
                        </TouchableOpacity>

                      </View>
                      <ReplyCollection  userId={this.userId}  videoId={this.videoId} fetchUrl={this.fetchUrl}
                                        onData={this.onData}
                                        videoReplyCount={this.videoReplyCount}
                                        amount={this.amount}
                                        listBottomPadding={this.state.currentHeight > this.initialHeight? 0 : listBottomPadding}
                      />
                    </View>
                  </React.Fragment>
                )}
              </SlidingUpPanel>
          </React.Fragment>
        );
    }

}


export default VideoRepliesScreen;
