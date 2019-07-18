import React, { Component } from 'react';
import {View,Image,TouchableWithoutFeedback} from 'react-native';
import VideoWrapper from "../../Home/VideoWrapper";
import { withNavigation } from 'react-navigation';

import closeIcon from '../../../assets/cross_icon.png';
import inlineStyles from './styles'


class VideoPlayer extends Component {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
          header: null
        };
      };

    constructor(props){
        super(props);
        this.videoId =  this.props.navigation.getParam('videoId');
        console.log("video-id" , this.videoId);
    }

    onCrossIconClick = () => {

    }

    render() {
        return (
          <View>
            <VideoWrapper   isActive={ true }
                            videoId={this.videoId}/>
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.goBack()}>
              <Image style={inlineStyles.closeIconSkipFont} source={closeIcon} onPress></Image>
            </TouchableWithoutFeedback>

          </View>

        )
    }
}

export default withNavigation( VideoPlayer );