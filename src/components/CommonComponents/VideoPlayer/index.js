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
        this.userId =  this.props.navigation.getParam('userId');
        console.log("video-id" , this.videoId);
    }

    onCrossIconClick = () => {

    }

    render() {
        return (
          <React.Fragment>
            <VideoWrapper   doRender={true}
                            isActive={ true }
                            videoId={this.videoId}
                            userId={this.userId}
            />
            <TouchableWithoutFeedback  onPressOut={()=>this.props.navigation.goBack()}>
                <View style={inlineStyles.closeBtWrapper}>
                  <Image style={inlineStyles.closeIconSkipFont} source={closeIcon}></Image>
                </View>

            </TouchableWithoutFeedback>

          </React.Fragment>

        )
    }
}

export default withNavigation( VideoPlayer );
