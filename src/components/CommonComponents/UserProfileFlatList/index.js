import React, { PureComponent } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Text,
  Dimensions,
  Image
} from "react-native";
import {SafeAreaView, withNavigation} from "react-navigation";
import FastImage from 'react-native-fast-image';
import reduxGetters from "../../../services/ReduxGetters"; 

import AppConfig from "../../../constants/AppConfig"; 
import Pricer from '../../../services/Pricer';
import Pagination from "../../../services/Pagination";

import {fetchUser} from "../../../helpers/helpers";

import inlineStyles from './style';


import pepoWhiteIcon from '../../../assets/pepo-white-icon.png'


class UserProfileFlatList extends PureComponent {
    constructor(props){
        super(props);
        this.videoHistoryPagination = new Pagination( this._fetchUrlVideoHistory() );
        this.paginationEvent = this.videoHistoryPagination.event;

        this.state = {
          list :  this.videoHistoryPagination.getList(),
          refreshing : false, 
          loadingNext: false
        }
    }

    componentDidMount(){
        this.paginationEvent.on("onBeforeRefresh" , this.beforeRefresh.bind(this) );
        this.paginationEvent.on("onRefresh" ,  this.onRefresh.bind(this) );
        this.paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this));
        this.paginationEvent.on("onBeforeNext" , this.beforeNext.bind(this));
        this.paginationEvent.on("onNext" , this.onNext.bind(this) );
        this.paginationEvent.on("onNextError" , this.onNextError.bind(this));
        fetchUser(this.props.userId);
        this.videoHistoryPagination.initPagination();
    }

    componentWillUnmount(){
        this.paginationEvent.removeListener('onBeforeRefresh');
        this.paginationEvent.removeListener('onRefresh');
        this.paginationEvent.removeListener('onRefreshError');
        this.paginationEvent.removeListener('onBeforeNext');
        this.paginationEvent.removeListener('onNext');
        this.paginationEvent.removeListener('onNextError');
    }

    _fetchUrlVideoHistory(){
        return `/users/${this.props.userId}/video-history` ; 
    }

    getVideoBtAmount(videoId){
      return Pricer.getToBT( Pricer.getFromDecimal( reduxGetters.getVideoBt(videoId) ) ) ;
    }

    onPullToRefresh = () => {
      fetchUser(this.props.userId); 
    } 

    beforeRefresh = ( ) => {
        this.onPullToRefresh();
        this.setState({ refreshing : true }); 
    }

    onRefresh = ( res ) => {
        this.setState({ refreshing : false , list : this.videoHistoryPagination.getList() }); 
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

    _renderItem = ({ item, index }) => {
      const videoId = reduxGetters.getUserVideoId(item),
            imageUrl = reduxGetters.getVideoImgUrl( videoId,  null , AppConfig.userVideos.userScreenCoverImageWidth ) ;     
      return imageUrl ? (
        <TouchableWithoutFeedback onPress={() => { this.onVideoClick( item, index ) }}>
          <View>
            <FastImage style={{width: Dimensions.get('window').width / 3, aspectRatio:9/16, margin: 1}}
                       source={{
                        uri: imageUrl,
                        priority: FastImage.priority.high
                       }}/>
            <View style={inlineStyles.videoStatsContainer}>
              <Image style={{height: 16, width: 16}} source={pepoWhiteIcon} />
              <Text style={inlineStyles.videoStatsTxt}>{this.getVideoBtAmount(videoId)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : <View/>;
    };

    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
     };

    onVideoClick = ( item, index  ) => {
        const clonedInstance = this.videoHistoryPagination.fetchServices.cloneInstance();
        this.props.navigation.push("UserVideoHistory", {
          fetchServices : clonedInstance,
          currentIndex: index,
          userId: this.props.userId
        });
    }

    listHeaderComponent = () => {
      return (
        <React.Fragment>
          {this.props.listHeaderComponent}
          {this.state.list.length > 0 && this.props.listHeaderSubComponent }
        </React.Fragment>
      )
    }

    render(){
        return(
            <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
                <FlatList
                    ListHeaderComponent={this.listHeaderComponent()}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    onRefresh={this.refresh}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={9}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderFooter}
                    numColumns={3}
                />
            </SafeAreaView>    
        );
    }
    
}


export default withNavigation( UserProfileFlatList );