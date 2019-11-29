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
import multipleClickHandler from '../../../services/MultipleClickHandler';

import inlineStyles from './style';
import pepoWhiteIcon from '../../../assets/pepo-white-icon.png'
import LinearGradient from "react-native-linear-gradient";
import CurrentUser from "../../../models/CurrentUser";
import DeleteVideo from "../DeleteVideo";
import Colors from '../../../theme/styles/Colors';
import CommonStyle from "../../../theme/styles/Common"
import VideoThumbnail from '../../CommonComponents/VideoThumbnail/VideoThumbnail';
import DataContract from '../../../constants/DataContract';


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
        this.listRef = null ;
    }

    componentDidMount(){
        this.paginationEvent.on("onBeforeRefresh" , this.beforeRefresh.bind(this) );
        this.paginationEvent.on("onRefresh" ,  this.onRefresh.bind(this) );
        this.paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this));
        this.paginationEvent.on("onBeforeNext" , this.beforeNext.bind(this));
        this.paginationEvent.on("onNext" , this.onNext.bind(this) );
        this.paginationEvent.on("onNextError" , this.onNextError.bind(this));
        this.videoHistoryPagination.initPagination();
    }

    forceRefresh(){
      this.listRef.scrollToOffset({offset: 0});
      this.refresh();
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

    _fetchUrlVideoHistory(){
        return `/users/${this.props.userId}/video-history` ;
    }

    getVideoBtAmount(videoId){
      return Pricer.displayAmountWithKFomatter( Pricer.getFromDecimal( reduxGetters.getVideoBt(videoId) ) ) ;
    }

    onPullToRefresh = () => {
      fetchUser(this.props.userId , this.onUserFetch );
    }

    onUserFetch =(res) => {
      this.props.onUserFetch && this.props.onUserFetch(res);
    }

    beforeRefresh = ( ) => {
        this.props.beforeRefresh && this.props.beforeRefresh();
        this.onPullToRefresh();
        this.setState({ refreshing : true });
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

    _keyExtractor = (item, index) => `id_${item}`;

    _renderItem = ({ item, index }) => {
      const videoId = reduxGetters.getUserVideoId(item);
      return (<View style={{position: 'relative'}}>
                 {this.isCurrentUser() && <LinearGradient
                      colors={['rgba(0, 0, 0, 0.3)', 'transparent', 'transparent']}
                      locations={[0, 0.5, 1]}
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
            <SafeAreaView forceInset={{ bottom: 'never' }} style={CommonStyle.viewContainer}>
                <FlatList
                    ref={(ref)=>  {this.listRef = ref } }
                    ListHeaderComponent={this.listHeaderComponent()}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    onRefresh={this.refresh}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={9}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderFooter}
                    numColumns={2}
                />
            </SafeAreaView>
        );
    }

}

export default withNavigation( UserProfileFlatList );
