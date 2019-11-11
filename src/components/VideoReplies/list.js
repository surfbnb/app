import React, { PureComponent } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  StatusBar
} from "react-native";
import {SafeAreaView, withNavigation} from "react-navigation";

import Pagination from "../../services/Pagination";
import plusIcon from '../../assets/user-video-capture-icon-selected.png';
import inlineStyles from './styles';
import crossIcon from '../../assets/cross_icon.png';
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

        const ts = Date.now();
        this.noResultsKeyProp = "video_collection_no_results_" + ts;
        this.hasResultsKeyProp = "video_collection_has_results_" + ts;

        this.numColumns = 2;
        this.flatListKey = this.hasResultsKeyProp;
        this.listHeaderComponent =null;
        this.listHeaderSubComponent = null;
    }

    componentDidMount(){
        this.forcedRefresh();
        const ts = Date.now();
        this.noResultsKeyProp = "video_collection_no_results_" + ts;
        this.hasResultsKeyProp = "video_collection_has_results_" + ts;
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
        let fetchUrl = `/users/${this.props.userId}/video-history`//this.fetchUrl;
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
      // Check if this is an empty cell.
      if ( item.isEmpty) {
        // Render no results cell here.
        return this.props.getNoResultsCell(item);
      } else {
        // Render Video cell
        return this._renderVideoCell({item,index});
      }
    };

    _renderVideoCell = ({ item, index }) => {
        return (<VideoThumbnailItem
          payload={item.payload}
          index={index}
          onVideoClick={(videoId, index, compRef) => {this.onVideoClick(item.payload, index, compRef)}}
          isEmpty={item.isEmpty}
          emptyRenderFunction={this.props.getNoResultsCell}/>);
    };



    onVideoClick = (payload, index, videoThumbnailMeasurements) => {
        const clonedInstance = this.videoPagination.fetchServices.cloneInstance();
        this.props.navigation.push("VideoRepliesFullScreen", {
            "fetchServices" : clonedInstance,
            "currentIndex": index,
            "payload": payload,
            "baseUrl": this.props.fetchUrl,
            "showBalanceFlyer": this.showBalanceFlyer,
            "videoThumbnailMeasurements": videoThumbnailMeasurements
        });
    }
    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
    };

    getListHeaderComponent = () => {
        return (
          <React.Fragment>
              {this.listHeaderComponent}
              {this.state.list.length > 0 && this.listHeaderSubComponent }
          </React.Fragment>
        )
    };

    getResultList(){
      let list = this.videoPagination.getResults();
      if( list.length > 0 ){
        this.numColumns = 2;
        this.flatListKey = this.hasResultsKeyProp;
        return list;
      } else {
        this.numColumns = 1;
        this.flatListKey = this.noResultsKeyProp;
        return [this.props.noResultsData];
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
                ListHeaderComponent={this.getListHeaderComponent()}
                data={this.state.list}
                onEndReached={this.getNext}
                onRefresh={this.refresh}
                keyExtractor={this._keyExtractor}
                refreshing={this.state.refreshing}
                onEndReachedThreshold={4}
                renderItem={this._renderItem}
                ListFooterComponent={this.renderFooter}
                numColumns={this.numColumns}
                key={this.flatListKey}
              />
          </SafeAreaView>
        );
    }

}

export default  withNavigation( VideoReplyList );
