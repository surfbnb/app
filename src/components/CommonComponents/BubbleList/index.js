import React, { PureComponent } from 'react';
import inlineStyles from './styles';
import { Text, View, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';

import DataContract from '../../../constants/DataContract';
import PepoApi from "../../../services/PepoApi";
import deepGet from "lodash/get";
import ProfilePicture from "../../ProfilePicture";
import reduxGetter from "../../../services/ReduxGetters";
import multipleClickHandler from '../../../services/MultipleClickHandler';
import {FetchServices} from "../../../services/FetchServices";
import SingleBubble from '../SingleBubble';
import {connect} from "react-redux";
import reduxGetters from '../../../services/ReduxGetters';




const mapStateToProps = (state, ownProps) => {
  return {
    replyCount : reduxGetter.getVideoReplyCount(ownProps.videoId)
  };
};


//
const NO_OF_ITEMS_TO_SHOW = 3;

class BubbleList extends PureComponent {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
    this.fetchServices = new FetchServices(this.getFetchUrl());
    this.getDataWhileLoading();
    this.onClickHandler = this.props.onClickHandler || this.defaultClickHandler;
  }

  componentDidUpdate(prevProps, prevState ) {
    if( this.props.doRender && this.props.doRender !== prevProps.doRender  ){
      this.getListData();
    }
    if (this.props.replyCount |= prevProps.replyCount){
      this.getListData();
    }
  }


  getFetchUrl = () => {
    return `/videos/${this.props.videoId}/replies`;
  };



  getDataWhileLoading(){
    if (this.props.doRender){
      this.getListData();
    }
  };

  getListData = () => {

    this.getFetchService()
      .refresh()
      .then((res) => {
        this.onRefresh(res);
      })
      .catch((error) => {
        //this.onRefreshError(error);
        console.log(error);
      });
  };


  onRefresh = (res) => {
    let listToBeShownOnUI = this.fetchServices.getAllResults().slice(0,NO_OF_ITEMS_TO_SHOW);
    this.replyCount =  reduxGetter.getVideoReplyCount(this.props.videoId);
    this.setState({ list : listToBeShownOnUI } );

  };




  getBubbleListJSX = () => {
    let listToRender = this.state.list;
    return listToRender.length? listToRender.map((item) => {
      let userId = deepGet(item,'payload.user_id'),
      replyDetailId=deepGet(item,'payload.reply_detail_id');
      return <SingleBubble userId={userId} replyDetailId={replyDetailId}  />
    }): <></> ;
  };

  moreReplyText = () => {

    let list = this.state.list;
    if (! this.replyCount || ! list.length){
      return ''
    }
    if (this.replyCount > list.length){
      return ` + ${this.replyCount - list.length} Replies`;
    }
  };

  getFetchService = () => {
    return this.fetchServices;
  }

  defaultClickHandler= ()=> {
    const baseUrl = DataContract.replies.getReplyListApi(this.props.videoId);
    this.props.navigation.push('FullScreenReplyCollection',{
      "baseUrl": baseUrl,
      "fetchServices":this.getFetchService()
        });
  }

  render() {
    return <View style={inlineStyles.bubbleContainer}>
        <TouchableOpacity onPress={multipleClickHandler(() => {this.onClickHandler()})} 
             style={{flexDirection: 'row-reverse', marginRight: 5}}>{this.getBubbleListJSX()}
        </TouchableOpacity>
        {/*<Text style={inlineStyles.repliesTxt}>{this.moreReplyText()}</Text>*/}
      </View>
  }
}


//make this component available to the app
export default connect(mapStateToProps)(withNavigation(BubbleList)) ;
