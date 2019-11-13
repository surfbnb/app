import React, { Component } from 'react';
import {View,Image,TouchableOpacity, Text} from 'react-native';
import VideoRowComponent from "../../UserVideoHistory/UserVideoHistoryRow";
import TopStatus from "../../Home/TopStatus";
import deepGet from "lodash/get";
import PepoApi from "../../../services/PepoApi";
import inlineStyles from './styles'
import historyBack from "../../../assets/user-video-history-back-icon.png";
import video_not_available from '../../../assets/video-not-available.png';
import Utilities from '../../../services/Utilities';
import CurrentUser from '../../../models/CurrentUser';
import reduxGetter from '../../../services/ReduxGetters';

class VideoPlayer extends Component {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
          headerBackTitle: null,
          header: null
        };
      };

    constructor(props){
        super(props);
        this.videoId =  this.props.navigation.getParam('videoId');
        this.state = {
          userId :  this.props.navigation.getParam('userId') || null,
          isDeleted : reduxGetter.isVideoDeleted(this.videoId)
        };
        this.refetchVideo();
        this.isActiveScreen = true;
    }

    componentDidMount(){
      this.willFocusSubscription = this.props.navigation.addListener('willFocus', (payload) => {
        this.isActiveScreen = true ;
      });

      this.willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) => {
        this.isActiveScreen =  false ;
      });
    }

    componentWillUnmount(){
      this.onRefetchVideo = () => {};
      this.willFocusSubscription && this.willFocusSubscription.remove();
      this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    shouldPlay = () => {
      return this.isActiveScreen;
    };

    refetchVideo = () => {
      if (this.state.isDeleted) return;
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

    navigateToUserProfile = (e) => {
      if (Utilities.checkActiveUser()) {
        if (this.state.userId == CurrentUser.getUserId()) {
          this.props.navigation.navigate('ProfileScreen');
        } else {
          this.props.navigation.push('UsersProfileScreen', { userId: this.state.userId });
        }
      }
    };

    render() {
        if(this.state.isDeleted){
         return <View style={inlineStyles.container}>
                  <TouchableOpacity onPressOut={()=>this.props.navigation.goBack()} style={inlineStyles.historyBackSkipFont}>
                    <Image style={{ width: 14.5, height: 22 }} source={historyBack} />
                  </TouchableOpacity>
                  <Image style={inlineStyles.imgSizeSkipFont} source={video_not_available} />
                  <Text style={inlineStyles.desc}>Looks like the Video you were looking for isn’t available and might have been deleted by the creator!</Text>
                </View>
        }else{
          return (
            <View style={{flex:1}}>
              <TopStatus />
              <VideoRowComponent doRender={true} isActive={ true }  shouldPlay={this.shouldPlay}
                                 videoId={this.videoId} userId={this.state.userId}
                                 onWrapperClick={this.navigateToUserProfile}/>
              <TouchableOpacity onPressOut={()=>this.props.navigation.goBack()} style={inlineStyles.historyBackSkipFont}>
                <Image style={{ width: 14.5, height: 22 }} source={historyBack} />
              </TouchableOpacity>
            </View>
          )
        }
    }
}

export default  VideoPlayer ;
