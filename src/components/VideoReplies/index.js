import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated
} from "react-native";
import {SafeAreaView} from "react-navigation";

import plusIcon from '../../assets/user-video-capture-icon-selected.png';
import inlineStyles from './styles';
import crossIcon from '../../assets/cross_icon.png';

import SlidingUpPanel from "../CommonComponents/SlidingUpPanel";


import { getInset } from 'react-native-safe-area-view';
const { width, height } = Dimensions.get('window');
const landScape = width > height;
const topPadding = getInset('top', landScape);
const bottomPadding = getInset('bottom', landScape);

import VideoReplyList from "./list";


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
      this.fetchUrl = props.navigation.getParam('fetchUrl');
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
      this.props.navigation.push('CaptureVideo'); 
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
                <View style={[inlineStyles.container, {backgroundColor: "#fff"}]}>
                  <View style={inlineStyles.dragHandler} {...dragHandler}>
                    
                    <TouchableOpacity onPress={this.onCrossIconClick} style={inlineStyles.iconWrapper} >
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
                        <Image style={[inlineStyles.iconSkipFont]} source={plusIcon} />
                    </TouchableOpacity>

                  </View>
                  <VideoReplyList  userId={this.userId}  videoId={this.videoId} fetchUrl={this.fetchUrl} />
                </View>
              )}
            </SlidingUpPanel>
        );
    }

}


export default VideoRepliesScreen;
