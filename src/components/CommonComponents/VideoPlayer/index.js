import React, { Component } from 'react';
import VideoWrapper from "../../Home/VideoWrapper";
import { withNavigation } from 'react-navigation';

class VideoPlayer extends Component {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
          header: null
        };
      };

    constructor(props){
        super(props);
        this.videoId =  this.props.navigation.getParam('videoId');
    }

    onCrossIconClick = () => {

    }

    render() {
        return (
            <VideoWrapper   isActive={ true }
                             videoId={this.videoId}/>
        )
    }
}

export default withNavigation( VideoPlayer );