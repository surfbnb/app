import React, { PureComponent } from 'react';
import { View, Text, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import {withNavigation} from "react-navigation";

import inlineStyles from "./style";
import Pagination from '../../services/Pagination';
import DataContract from '../../constants/DataContract';
import reduxGetters from '../../services/ReduxGetters';
import CurrentUser from '../../models/CurrentUser';
import VideoThumbnail from '../CommonComponents/VideoThumbnail/VideoThumbnail';
import DeleteVideo from "../CommonComponents/DeleteVideo";

class PostsTabBar extends PureComponent{
  constructor(props){
    super(props);
    this.videoHistoryPagination = new Pagination( this._fetchUrlVideoHistory() );
    this.paginationEvent = this.videoHistoryPagination.event;
    this.state = {
      list        :  this.videoHistoryPagination.getList(),
      refreshing  : false,
      loadingNext : false
    }
  }

  componentDidMount = () =>{
    this.paginationEvent.on("onBeforeRefresh" , this.beforeRefresh.bind(this) );
    this.paginationEvent.on("onRefresh" ,  this.onRefresh.bind(this) );
    this.paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this));
    this.paginationEvent.on("onBeforeNext" , this.beforeNext.bind(this));
    this.paginationEvent.on("onNext" , this.onNext.bind(this) );
    this.paginationEvent.on("onNextError" , this.onNextError.bind(this));
    this.videoHistoryPagination.initPagination();
  }

  componentWillUnmount(){
    this.paginationEvent.removeListener('onBeforeRefresh');
    this.paginationEvent.removeListener('onRefresh');
    this.paginationEvent.removeListener('onRefreshError');
    this.paginationEvent.removeListener('onBeforeNext');
    this.paginationEvent.removeListener('onNext');
    this.paginationEvent.removeListener('onNextError');
    if( this.props.refreshEvent) {
      this.props.refreshEvent.removeListener("refresh");
    }
  }
  _fetchUrlVideoHistory = () =>{
    return `/users/${this.props.userId}/video-history` ;
  }

  beforeRefresh = ( ) => {
    this.props.beforeRefresh && this.props.beforeRefresh();
    this.onPullToRefresh();
    this.setState({ refreshing : true });
  }

  onPullToRefresh = () => {
    this.videoHistoryPagination.refresh();
  }

  onRefresh = ( res ) => {
    const list = this.videoHistoryPagination.getList()  ;
    this.props.onRefresh && this.props.onRefresh( list , res );
    this.setState({ refreshing : false , list : list });
  }

  onRefreshError = ( error ) => {
    this.setState({ refreshing : false });
  }

  beforeNext =() => {
    this.setState({ loadingNext : true });
  }

  onNext = ( res  ) => {
    this.setState({ loadingNext : false ,  list : this.videoHistoryPagination.getList() });
  }

  onNextError = ( error ) => {
    this.setState({ loadingNext : false });
  }

  getNext = () => {
    this.videoHistoryPagination.getNext();
  }

  refresh = () => {
    this.videoHistoryPagination.refresh();
  }

  _keyExtractor = (item, index) => `id_${item}`;

  isCurrentUser = () => {
    return this.props.userId === CurrentUser.getUserId();
  }

  removeVideo = (videoId, index) => {
    if (index > -1) {
      this.videoHistoryPagination.deleteItem(videoId , "payload.video_id");
      let array = [...this.state.list]; // make a separate copy of the array
      array.splice(index, 1);
      this.setState({list: array});
      this.props.onDelete && this.props.onDelete(array);
    }
  }

  _renderItemPosts = ({ item, index }) => {
    const videoId = reduxGetters.getUserVideoId(item);
    return (<View style={{position: 'relative'}}>
      {this.isCurrentUser() && <LinearGradient
        colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)']}
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{width: (Dimensions.get('window').width - 6) / 2, margin: 1, position: 'absolute', top: 0, left: 0, zIndex: 1, alignItems: 'flex-end'}}
      >
        <View style={inlineStyles.deleteButton}>
          <DeleteVideo  fetchUrl={DataContract.videos.getDeleteVideoApi(videoId)}
                        removeVideo={() => {this.removeVideo(videoId , index )}} />
        </View>
      </LinearGradient>}
      <VideoThumbnail payload={{video_id:videoId, user_id: this.props.userId }}
                      index={index}  onVideoClick={() => {this.onVideoClick(item, index)}}/>
    </View>);
  };

  onVideoClick = ( item, index  ) => {
    const clonedInstance = this.videoHistoryPagination.fetchServices.cloneInstance();
    this.props.navigation.push("UserVideoHistory", {
      fetchServices : clonedInstance,
      currentIndex: index,
      userId: this.props.userId
    });
  }
  renderFooter = () => {
    if (!this.state.loadingNext) return null;
    return <ActivityIndicator />;
  };

  render(){
    return(
      <FlatList
        listKey={(item,index) => { index.toString()}}
        data = {this.state.list}
        onEndReached={this.getNext}
        onRefresh={this.refresh}
        keyExtractor={this._keyExtractor}
        refreshing={this.state.refreshing}
        onEndReachedThreshold={9}
        renderItem={this._renderItemPosts}
        ListFooterComponent={this.renderFooter}
        numColumns={2}
      >
      </FlatList>

    )
  }
}

export default withNavigation(PostsTabBar);