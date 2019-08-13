import React, { Component } from 'react';
import {View,Image,TouchableWithoutFeedback} from 'react-native';
import VideoRowComponent from "../../UserVideoHistory/UserVideoHistoryRow";
import { withNavigation } from 'react-navigation';
import deepGet from "lodash/get";
import PepoApi from "../../../services/PepoApi";

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
        this.state = {
          userId :  this.props.navigation.getParam('userId') || null
        }
        if(!this.state.userId){
          this.refetchVideo();
        }
    }

    componentWillUnmount(){
      onRefetchVideo = () => {};
    }

    refetchVideo = () => {
      new PepoApi(`/videos/${this.videoId}`)
        .get()
        .then((res) => { this.onRefetchVideo(res) })
        .catch((error) => {});
    };

    onRefetchVideo = ( res ) => {
      const users = deepGet(res , "data.users") || {} ,
            userKeys =  Object.keys(users) || [] ; 
      userId = userKeys[0] || null;
      if(userId){
        this.setState({ userId : userId});
      }
    }

    render() {
        return (
          <React.Fragment>
            <VideoRowComponent doRender={true}  isActive={ true }  videoId={this.videoId} userId={this.state.userId}/>
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
