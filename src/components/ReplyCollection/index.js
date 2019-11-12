import React, { PureComponent } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  StatusBar,
  View
} from "react-native";
import {SafeAreaView, withNavigation} from "react-navigation";

import Pagination from "../../services/Pagination";
import VideoThumbnailItem from '../CommonComponents/VideoThumbnailItem';
import deepGet from "lodash/get";


class VideoReplyList extends PureComponent {

    constructor(props){
      super(props);

        this.state = {
            list : [],
            refreshing : true,
            loadingNext: false
        };
        this.listRef = null;

        this.numColumns = 2;
    }

    componentDidMount(){
        this.initPagination();
        this.refresh();
    }

    componentWillUnmount() {
        this.removePaginationListeners();
    }

    getPagination = () => {
        return this.videoPagination;
    };

    // region - Pagination and Event Handlers

    initPagination() {
        // First, take care of existing Pagination if exists.
        this.removePaginationListeners();

        // Now, create a new one.
        let fetchUrl = this.props.fetchUrl;
        this.videoPagination = new Pagination(fetchUrl);
        this.bindPaginationEvents();
    }

    bindPaginationEvents(){
        let pagination = this.videoPagination;
        if ( !pagination ) {
            return;
        }
        let paginationEvent = pagination.event;
        if ( null === paginationEvent ) {
            return;
        }

        paginationEvent.on("onBeforeRefresh" , this.beforeRefresh.bind(this) );
        paginationEvent.on("onRefresh" ,  this.onRefresh.bind(this) );
        paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this));
        paginationEvent.on("onBeforeNext" , this.beforeNext.bind(this));
        paginationEvent.on("onNext" , this.onNext.bind(this) );
        paginationEvent.on("onNextError" , this.onNextError.bind(this));
    }

    removePaginationListeners(){
        let pagination = this.videoPagination;
        if ( !pagination ) {
            return;
        }
        let paginationEvent = pagination.event;
        if ( null === paginationEvent ) {
            return;
        }
        paginationEvent.removeListener('onBeforeRefresh');
        paginationEvent.removeListener('onRefresh');
        paginationEvent.removeListener('onRefreshError');
        paginationEvent.removeListener('onBeforeNext');
        paginationEvent.removeListener('onNext');
        paginationEvent.removeListener('onNextError');
    }

    beforeRefresh = ( ) => {
        this.setState({ refreshing : true });
    };

    onRefresh = ( res ) => {
        const list = this.getResultList();
        this.props.onRefresh && this.props.onRefresh( list , res );
        this.setState({
          refreshing : false,
          list : list
        });
    };

    onRefreshError = ( error ) => {
        this.setState({ refreshing : false });
    };

    beforeNext =() => {
        this.setState({ loadingNext : true });
    };

    onNext = ( res  ) => {
        this.setState({
          loadingNext : false,
          list : this.getResultList()
        });
    }

    onNextError = ( error ) => {
        this.setState({ loadingNext : false });
    };

    getNext = () => {
        this.videoPagination.getNext();
    };

    refresh = () => {
        this.videoPagination.refresh();
    };

    _keyExtractor = (item, index) => {
        return `id_${item.id}`;
    }

    _renderItem = ({ item, index }) => {
        // Render Video cell
        return this._renderVideoCell({item,index});
    };

    _renderVideoCell = ({ item, index }) => {
        //TODO Let ask BE for same payload
        const payload = { user_id : deepGet(item, "payload.user_id") ,  video_id: deepGet(item, "payload.reply_detail_id")}
        return (<VideoThumbnailItem
          payload={payload}
          index={index}
          onVideoClick={() => {this.onVideoClick(payload, index)}}/>);
    };

    onVideoClick = (payload, index) => {
        const clonedInstance = this.videoPagination.fetchServices.cloneInstance();
        //TODO @ashutosh to understand
        this.props.navigation.push("FullScreenReplyCollection", {
            "fetchServices" : clonedInstance,
            "currentIndex": index,
            "payload": payload,
            "baseUrl": this.props.fetchUrl,
            "amount": this.props.amount,
            "videoReplyCount": this.props.videoReplyCount,
            'parentUserId': this.props.userId,
            'parentVideoId': this.props.videoId
        });
    }


    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
    };

    getResultList(){
      return this.videoPagination.getResults();
    }

    scrollToTop(){
        this.listRef.scrollToOffset({offset: 0});
    }

    setListRef = (listRef) => {
      this.listRef = listRef;
    };

    render(){
        return (
            <FlatList
                style={{flex:1, width: "100%"}}
                ref={this.setListRef}
                data={this.state.list}
                onEndReached={this.getNext}
                onRefresh={this.refresh}
                keyExtractor={this._keyExtractor}
                refreshing={this.state.refreshing}
                onEndReachedThreshold={4}
                renderItem={this._renderItem}
                ListFooterComponent={this.renderFooter}
                numColumns={this.numColumns}
            />
        );
    }

}

export default  withNavigation( VideoReplyList );
