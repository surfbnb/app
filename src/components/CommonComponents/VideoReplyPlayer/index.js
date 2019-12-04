import React, { PureComponent } from 'react';
import { View, ActivityIndicator} from 'react-native';

import deepGet from "lodash/get";
import PepoApi from "../../../services/PepoApi";
import Utilities from '../../../services/Utilities';
import reduxGetter from '../../../services/ReduxGetters';
import DataContract from '../../../constants/DataContract';
import DeletedVideoInfo from '../DeletedVideoInfo';
import FloatingBackArrow from "../../CommonComponents/FlotingBackArrow";
import ReplyList from "../../CommonComponents/ReplyList";
import { fetchVideo } from '../../../helpers/helpers'
import { FetchServices } from '../../../services/FetchServices';

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
          isLoading: true,
          isDeleted : false
        };
        this.isActiveScreen = true;
        this.fetchService =  null;
        this.currentIndex = 0;
    }

    componentDidMount(){
      this.willFocusSubscription = this.props.navigation.addListener('willFocus', (payload) => {
        this.isActiveScreen = true ;
      });

      this.willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) => {
        this.isActiveScreen =  false ;
      });
      this.setParentVideoId();
    }

    componentWillUnmount(){
      this.onReplyFetch = () => {};
      this.willFocusSubscription && this.willFocusSubscription.remove();
      this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    setParentVideoId() {
      this.parentVideoId = this.props.navigation.getParam('parentVideoId') || reduxGetter.getReplyParentVideoId( this.replyDetailId );
      if(this.parentVideoId) {
        this.fetchReplies();
      } else {
        this.fetchReply();
      }
    }

    fetchReply = () => {
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
      const replyDetails = deepGet(res , `data.${DataContract.replies.replyDetailsKey}`) ,
            item = replyDetails[this.replyDetailId]
      this.parentVideoId = deepGet(item, DataContract.replies.parentVideoIdKey);
      this.fetchReplies();
    };

    fetchReplies() {
      fetchVideo( this.parentVideoId ); // To save video details in redux if not present, the videoreplyrow fetches video details anyways
      this.fetchService = new FetchServices(`${DataContract.replies.getReplyListApi( this.parentVideoId )}?${DataContract.replies.replyDetailIdKey}=${this.replyDetailId}`);
      this.fetchReplyList();
    }

    fetchReplyList = ( ) => {
      this.fetchService.fetch()
      .then(( res )=> {
        this.onReplyListFetch(res);
      })
    }

    onReplyListFetch = ( res ) => {
      const list = this.fetchService.getAllResults();
      list.forEach(( item, index )=>{
        const rId = deepGet(item, `payload.${DataContract.replies.replyDetailIdKey}`);
        if( rId == this.replyDetailId){
          this.currentIndex = index;
        }
      });
      if( this.currentIndex < 0 ){
        if(this.fetchService.hasNextPage){
          this.fetchReplyList();
        }
      }else{
        this.setState({isLoading: false});
      }
    } 

    shouldPlay = () => {
      return this.isActiveScreen;
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
        userId: reduxGetter.getReplyParentUserId( this.replyDetailId ),
        videoId: parentVideoId
      });
    }

    isActiveEntity = (fullVideoReplyId , item , index)=> {
      let replyId = deepGet(item, `payload.${DataContract.replies.replyDetailIdKey}`)
        return fullVideoReplyId == replyId;
    }

    render() {
      if(this.state.isDeleted){
        return <DeletedVideoInfo/>
       }else{
         if(this.state.isLoading){
           return (<View style={{ width: "100%", flex: 1 , alignItems: "center" ,height:"100%", backgroundColor:"#000"}}>
                     <FloatingBackArrow/>
                     <ActivityIndicator style={{paddingTop: 100 }}/>
                   </View> )
         }else{
           return <ReplyList currentIndex={this.currentIndex}
                             fetchServices={this.fetchService}
                             parentClickHandler={this.parentClickHandler}/>
         }
       }
    }
}

export default VideoReplyPlayer ;
