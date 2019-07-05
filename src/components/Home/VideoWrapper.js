import React, { PureComponent } from 'react';
import {TouchableWithoutFeedback} from "react-native";
import Video from 'react-native-video';

import inlineStyles from "./styles"; 


class VideoWrapper extends PureComponent {

    constructor(props){
        super(props);
        this.player = null;
        this.state = {
            paused : false
        }
    }

    isPaused(){
        return !this.props.isActive || this.state.paused;
    }

    render(){
        return (
            <TouchableWithoutFeedback onPress={()=> this.setState({ paused : !this.state.paused })}>
                <Video
                style={inlineStyles.fullHeight}
                paused={ this.isPaused() }
                resizeMode={"contain"}
                source={{uri: this.props.videoUrl}}  
                repeat={true}/>
           </TouchableWithoutFeedback> 
        )
    }

}

export default  VideoWrapper  ; 