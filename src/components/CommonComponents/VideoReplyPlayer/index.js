import React, { PureComponent } from 'react';
import TopStatus from "../../Home/TopStatus";
import deepGet from "lodash/get";
import PepoApi from "../../../services/PepoApi";
import Utilities from '../../../services/Utilities';
import reduxGetter from '../../../services/ReduxGetters';
import DataContract from '../../../constants/DataContract';
import DeletedVideoInfo from '../DeletedVideoInfo';
import VideoReplyRow from '../../FullScreenReplyCollection/VideoReplyRow';
import FlotingBackArrow from "../../CommonComponents/FlotingBackArrow";
import CommonStyles from "../../../theme/styles/Common";
import { SafeAreaView } from "react-navigation";
import { fetchVideo } from '../../../helpers/helpers';

class VideoReplyPlayer extends PureComponent {

    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
          headerBackTitle: null,
          header: null
        };
      };

    constructor(props){
        super(props);
        this.replyDetailId =  this.props.navigation.getParam('replyDetailId');
        this.state = {
          userId :  this.props.navigation.getParam('userId') || null,
          isLoading: true,
          isDeleted : false
        };
        this.fetchReply();
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
      this.onReplyFetch = () => {};
      this.willFocusSubscription && this.willFocusSubscription.remove();
      this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    shouldPlay = () => {
      return this.isActiveScreen;
    };

    fetchReply = () => {
      if (this.state.isDeleted) return;
      new PepoApi(DataContract.replies.getSingleVideoReplyApi(this.replyDetailId))
        .get()
        .then((res) => { this.onReplyFetch(res) })
        .catch((error) => {});   
    };

    onReplyFetch = ( res ) => {
      if(Utilities.isEntityDeleted(res)){
        this.setState({isDeleted: true});
        return;
      }
      const users = deepGet(res , "data.users") || {} ,
            userKeys =  Object.keys(users) || [] ,
            userId = userKeys[0] || null;
      if(userId){
        this.setState({ userId : userId ,  isLoading : false});
      }
    };

    getPixelDropData = () => {
      return pixelParams = {
        e_entity: 'reply',
        p_type: 'single_reply',
        p_name: this.replyDetailId,
      };
    }

    parentClickHandler =()=>{
      const parentVideoId =  reduxGetter.getReplyParentVideoId(this.replyDetailId);
      this.props.navigation.push('VideoPlayer', {
        userId: this.state.userId,
        videoId: parentVideoId
      });
    }

    render() {
        if(this.state.isDeleted){
         return <DeletedVideoInfo/>
        }else{
          return (
            <SafeAreaView forceInset={{ top: 'never' }}  style={ CommonStyles.fullScreenVideoSafeAreaContainer}>
              <TopStatus />
              {!this.state.isLoading && ( <VideoReplyRow shouldPlay={this.shouldPlay}
                    isActive={true}
                    doRender={true}
                    userId={this.state.userId}
                    parentVideoId={this.state.parentVideoId}
                    replyDetailId={this.replyDetailId}
                    getPixelDropData={this.getPixelDropData}
                    parentClickHandler={this.parentClickHandler}
              />)}
             <FlotingBackArrow />
            </SafeAreaView>
          )
        }
    }
}

export default  VideoReplyPlayer ;
