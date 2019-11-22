import React, { PureComponent } from 'react';
import TopStatus from "../../Home/TopStatus";
import deepGet from "lodash/get";
import PepoApi from "../../../services/PepoApi";
import Utilities from '../../../services/Utilities';
import reduxGetter from '../../../services/ReduxGetters';
import ReduxGetters from '../../../services/ReduxGetters';
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
        this.videoId = ReduxGetters.getReplyEntityId(this.replyDetailId); //Check for entity deleted 
        this.state = {
          userId :  this.props.navigation.getParam('userId') || null,
          isDeleted : reduxGetter.isVideoEntityDeleted(this.videoId)
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
      new PepoApi(DataContract.replies.getSingleVideoReplyApi(this.replyDetailId))
        .get()
        .then((res) => { this.onRefetchVideo(res) })
        .catch((error) => {});   
    };

    onRefetchVideo = ( res ) => {
      if(Utilities.isEntityDeleted(res)){
        this.setState({isDeleted: true});
        return;
      }
      this.fetchParentVideo( res );
      const users = deepGet(res , "data.users") || {} ,
            userKeys =  Object.keys(users) || [] ,
            userId = userKeys[0] || null;
      if(userId){
        this.setState({ userId : userId});
      }
    };

    fetchParentVideo = (res) => {
      const parentVideoId =  deepGet(res, `data.reply_details.${this.replyDetailId}.parent_id` );
      fetchVideo(parentVideoId);
    }

    getPixelDropData = () => {
      return pixelParams = {
        e_entity: 'reply',
        p_type: 'single_reply',
        p_name: this.replyDetailId,
      };
    } 

    render() {
        if(this.state.isDeleted){
         return <DeletedVideoInfo/>
        }else{
          return (
            <SafeAreaView forceInset={{ top: 'never' }}  style={ CommonStyles.fullScreenVideoSafeAreaContainer}>
              <TopStatus />
              <VideoReplyRow shouldPlay={this.shouldPlay}
                    isActive={true}
                    doRender={true}
                    userId={this.state.userId}
                    replyDetailId={this.replyDetailId}
                    getPixelDropData={this.getPixelDropData}
              />
             <FlotingBackArrow />
            </SafeAreaView>
          )
        }
    }
}

export default  VideoReplyPlayer ;
