import React, { Component } from 'react';
import {View,Image,TouchableOpacity, Text} from 'react-native';
import VideoRowComponent from "../../UserVideoHistory/UserVideoHistoryRow";
import { withNavigation } from 'react-navigation';
import deepGet from "lodash/get";
import PepoApi from "../../../services/PepoApi";

import inlineStyles from './styles'
import historyBack from "../../../assets/user-video-history-back-icon.png";
import video_not_available from '../../../assets/video-not-available.png';
import Utilities from '../../../services/Utilities';


class VideoPlayer extends Component {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
          header: null
        };
      };

    constructor(props){
        super(props);
        this.videoId =  this.props.navigation.getParam('videoId');
        this.state = {
          userId :  this.props.navigation.getParam('userId') || null,
          isDeleted : false
        }
        this.refetchVideo();
    }

    componentWillUnmount(){
      this.onRefetchVideo = () => {};
    }

    refetchVideo = () => {
      new PepoApi(`/videos/${this.videoId}`)
        .get()
        .then((res) => { this.onRefetchVideo(res) })
        .catch((error) => {});
    };

    onRefetchVideo = ( res ) => {
      if(Utilities.isEntityDeleted(res)){
        this.setState({isDeleted: true});
        return;
      }
      const users = deepGet(res , "data.users") || {} ,
            userKeys =  Object.keys(users) || [] ,
            userId = userKeys[0] || null;
      if(userId){
        this.setState({ userId : userId});
      }
    };

    render() {
        if(this.state.isDeleted){
         return <View style={inlineStyles.container}>
                  <Image style={inlineStyles.imgSize} source={video_not_available} />
                  <Text style={inlineStyles.desc}>Looks like the Video you were looking for isn’t available and might have been deleted by the creator!</Text>
                </View>
        }else{
          return (
            <React.Fragment>
              <VideoRowComponent doRender={true} isActive={ true } videoId={this.videoId} userId={this.state.userId}/>
              <TouchableOpacity onPressOut={()=>this.props.navigation.goBack()} style={inlineStyles.historyBackSkipFont}>
                <Image style={{ width: 14.5, height: 22 }} source={historyBack} />
              </TouchableOpacity>
            </React.Fragment>
          )
        }
    }
}

export default withNavigation( VideoPlayer );
