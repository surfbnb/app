import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar
} from "react-native";
import {SafeAreaView} from "react-navigation";

import plusIcon from '../../assets/user-video-capture-icon-selected.png';
import inlineStyles from './styles';
import crossIcon from '../../assets/cross_icon.png';
import ReplyCollection from '../ReplyCollection';
import NavigationService from "../../services/NavigationService";
import utilities from "../../services/Utilities";

import SlidingUpPanel from "../CommonComponents/SlidingUpPanel";


import { getInset } from 'react-native-safe-area-view';
import DataContract from '../../constants/DataContract';
const { width, height } = Dimensions.get('window');
const landScape = width > height;
const topPadding = getInset('top', landScape);
const bottomPadding = getInset('bottom', landScape);

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
        this.amount = props.navigation.getParam('amount');
        this.videoReplyCount = props.navigation.getParam('videoReplyCount');
        this.fetchUrl = DataContract.replies.getReplyListApi(this.videoId);
        this.initialHeight =  height/1.5;
        this.animatedValue = new Animated.Value(this.initialHeight) ;
        this.listener = null;
        this.panelAnimateTimeOut = 0 ;

      this.state = {
        showBackdrop : false
      }
    }

    componentDidMount(){
      this.listener = this.animatedValue.addListener(this.onAnimatedValueChange);
      setTimeout(()=> {
        this.setState({showBackdrop: true});
      }, 500)
    }

    componentWillUnmount() {
      onAnimatedValueChange= () => {};
      this.animatedValue.removeListener(this.listener)
    }

    onAnimatedValueChange = ({ value }) => {
      clearTimeout(this.panelAnimateTimeOut);
      this.panelAnimateTimeOut =  setTimeout(()=> {
        if( value < 10){
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
          amount: navigation.getParam('amount'),
          videoReplyCount: navigation.getParam('videoReplyCount')
      };
      utilities.handleVideoUploadModal(activeTab, navigation, params);
    }

    render(){
        return (
            <SlidingUpPanel ref={c => (this._panel = c)}
                animatedValue={this.animatedValue}
                ref={c => (this._panel = c)}
                draggableRange={{
                  top: height - topPadding - bottomPadding, //TODO check is top expand
                  bottom: 0
                }}
                showBackdrop={this.state.showBackdrop}
                snappingPoints={[0, this.initialHeight, height]}>
              {dragHandler => (
                <View style={[inlineStyles.container]}>
                  <View style={inlineStyles.dragHandler} {...dragHandler}>
                    
                    <TouchableOpacity onPress={this.onCrossIconClick} style={[inlineStyles.iconWrapper]} >
                        <Image style={inlineStyles.iconSkipFont} source={crossIcon}></Image>
                    </TouchableOpacity>
                    
                    <View style={inlineStyles.repliesTxt}>
                      <Text numberOfLines={1} style={inlineStyles.headerText}>
                      Replies to Frankie
                      </Text>
                      {/* {TODO integration pending} */}
                      <Text style={inlineStyles.headerSubText}>Send a reply with Pepo5</Text>
                    </View>
                    
                    <TouchableOpacity onPress={this.openCamera} style={inlineStyles.iconWrapper} >
                        <Image style={[inlineStyles.iconSkipFont, {height: 25, width: 25}]} source={plusIcon} />
                    </TouchableOpacity>

                  </View>
                    <ReplyCollection  userId={this.userId}  videoId={this.videoId} fetchUrl={this.fetchUrl}
                                      videoReplyCount={this.videoReplyCount}
                                      amount={this.amount}
                    />
                </View>
              )}
            </SlidingUpPanel>
        );
    }

}


export default VideoRepliesScreen;
