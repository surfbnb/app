import React, { PureComponent } from 'react';
import inlineStyles from './styles';
import { Text, View, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';

import DataContract from '../../../constants/DataContract';
import deepGet from "lodash/get";
import reduxGetter from "../../../services/ReduxGetters";
import multipleClickHandler from '../../../services/MultipleClickHandler';
import SingleBubble from '../SingleBubble';
import {connect} from "react-redux";
import Utilities from '../../../services/Utilities';
import PepoApi from "../../../services/PepoApi";

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
    this.getDataWhileLoading();
    this.replyList = [];
  }

  componentDidUpdate(prevProps, prevState ) {
    if( this.props.doRender && this.props.doRender !== prevProps.doRender  ){
      this.getListData();
    }
    if (this.props.replyCount != prevProps.replyCount){
      this.getListData();
    }
  }


  getFetchUrl = () => {
    return `/videos/${this.props.videoId}/unseen-replies`;
  };



  getDataWhileLoading(){
    if (this.props.doRender){
      this.getListData();
    }
  };

  getListData = () => {

    if ( this.props.replyCount == 0 ) {
      return;
    }

    return new PepoApi(this.getFetchUrl())
      .get()
      .then((apiResponse) => {
        if (apiResponse.success){
          this.onRefresh(apiResponse);
        }

      })
      .catch((err) => {
        console.log('updateActivatingStatus', err);
      });
  };

  setReplyToLandOn = (list) => {
    if(list.length > 0) {
      let item = list[0];
      this.replyDetailId = deepGet(item,'reply_detail_id');
    }
  };

  getExtraItemUI = (key) => {
    return <View key={key} style={ {marginLeft: -34, zIndex: -1} }>
      <View style={inlineStyles.emptyBubble}></View>
    </View>;
  };

// <View style={{backgroundColor: '#ff5566', height: 50, width: 50, left: -56, borderRadius: 25, borderWidth: 2, borderColor: '#fff'}}></View>


  onRefresh = (res) => {
    this.replyList =  reduxGetter.getUnseenReplies(this.props.videoId);
    let listToShowOnUi =  this.replyList.slice(0,NO_OF_ITEMS_TO_SHOW).reverse();
    this.setReplyToLandOn(this.replyList);
    this.setState({ list : listToShowOnUi });
  };

  getBubbleListJSX = () => {
    let listToRender = this.state.list;
    let listJsx = [];
    if (this.replyList.length > NO_OF_ITEMS_TO_SHOW ){
      listJsx.push(this.getExtraItemUI(0));
      listJsx.push(this.getExtraItemUI(1));
    }

    listToRender.forEach((item) => {
      let userId = deepGet(item,'user_id'),
      replyDetailId=deepGet(item,'reply_detail_id');
      listJsx.push(<SingleBubble key={`${userId}-${replyDetailId}`} userId={userId} replyDetailId={replyDetailId}  />)
    });



    return listJsx.length ? listJsx : <></>;
  };

  // moreReplyText = () => {
  //
  //   let list = this.state.list;
  //   if (! this.replyCount || ! list.length){
  //     return ''
  //   }
  //   if (this.replyCount > list.length){
  //     return ` + ${this.replyCount - list.length} Replies`;
  //   }
  // };

  parentClickHandler = ()=> {
    this.props.navigation.goBack(null);
  }

  onClickHandler= ()=> {
    this.props.navigation.push('VideoReplyPlayer',{
      parentVideoId: this.props.videoId,
      replyDetailId: this.replyDetailId,
      parentClickHandler: this.parentClickHandler
    });
  };

  onIconClick = () => {
    if(!Utilities.checkActiveUser()) return;
    this.onClickHandler();
  };

  render() {
    return <View style={inlineStyles.bubbleContainer}>
        <TouchableOpacity onPress={multipleClickHandler(() => {this.onIconClick()})}
             style={{flexDirection: 'row-reverse', marginRight: 5}}>{this.getBubbleListJSX()}
        </TouchableOpacity>
        {/*<Text style={inlineStyles.repliesTxt}>{this.moreReplyText()}</Text>*/}
      </View>
  }
}


//make this component available to the app
export default connect(mapStateToProps)(withNavigation(BubbleList)) ;
