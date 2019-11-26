import React, { Component } from 'react';
import UserVideoHistoryRow from "../../UserVideoHistory/UserVideoHistoryRow";
import TopStatus from "../../Home/TopStatus";
import deepGet from "lodash/get";
import PepoApi from "../../../services/PepoApi";
import Utilities from '../../../services/Utilities';
import reduxGetter from '../../../services/ReduxGetters';
import DeletedVideoInfo from '../DeletedVideoInfo';
import CommonStyles from "../../../theme/styles/Common";
import FlotingBackArrow from "../../CommonComponents/FlotingBackArrow";
import { SafeAreaView } from "react-navigation";
import { fetchVideo } from '../../../helpers/helpers';

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
        this.bubbleClickHandler =  this.props.navigation.getParam('bubbleClickHandler');
        this.state = {
          userId :  this.props.navigation.getParam('userId') || null,
          isDeleted : false
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
      fetchVideo( this.videoId , this.onRefetchVideo );
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

    getPixelDropData = () => {
      return pixelParams = {
        p_type: 'single_video',
        p_name: this.videoId
      };
    }

    render() {
        if(this.state.isDeleted){
         return <DeletedVideoInfo/>
        }else{
          return (
            <SafeAreaView forceInset={{ top: 'never' }}  style={CommonStyles.fullScreenVideoSafeAreaContainer}>
              <TopStatus />
              <UserVideoHistoryRow doRender={true} isActive={ true }  shouldPlay={this.shouldPlay}
                                 videoId={this.videoId} userId={this.state.userId} getPixelDropData={this.getPixelDropData}
                                 bubbleClickHandler={this.bubbleClickHandler}/>
             <FlotingBackArrow />
            </SafeAreaView>
          )
        }
    }
}

export default  VideoPlayer ;
