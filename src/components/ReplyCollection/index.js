import React, { PureComponent } from 'react';
import {
  FlatList,
  ActivityIndicator,
  StatusBar
} from "react-native";
import {SafeAreaView, withNavigation} from "react-navigation";

import Pagination from "../../services/Pagination";
import VideoThumbnailItem from '../CommonComponents/VideoThumbnailItem';

class VideoReplyList extends PureComponent {

    constructor(props){
      super(props);

        this.state = {
            list : [],
            refreshing : false,
            loadingNext: false
        };
        this.listRef = null;

        this.numColumns = 2;
    }

    componentDidMount(){
        this.forcedRefresh();
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

    forcedRefresh (fetchUrl){
        this.initPagination();
        this.refresh();
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
        return (<VideoThumbnailItem
          payload={item.payload}
          index={index}
          onVideoClick={(videoId, index, compRef) => {this.onVideoClick(item.payload, index, compRef)}}/>);
    };



    onVideoClick = (payload, index) => {
        const clonedInstance = this.videoPagination.fetchServices.cloneInstance();
        this.props.navigation.push("FullScreenReplyCollection", {
            "fetchServices" : clonedInstance,
            "currentIndex": index,
            "payload": payload,
            "baseUrl": this.props.fetchUrl
        });
    }
    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
    };

    getResultList(){
      let list = this.videoPagination.getResults();
      if( list.length > 0 ){
        this.numColumns = 2;
        return list;
      } 
    }

    scrollToTop(){
        this.listRef.scrollToOffset({offset: 0});
    }

    setListRef = (listRef) => {
      this.listRef = listRef;
    };

    render(){
        return (
          <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
            <StatusBar translucent={true} backgroundColor={'transparent'} />
              <FlatList
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
          </SafeAreaView>
        );
    }

}

export default  withNavigation( VideoReplyList );
