import React, { PureComponent } from 'react';
import { ActivityIndicator , FlatList} from "react-native";
import {SafeAreaView} from "react-navigation";
import Pagination from "../../services/Pagination";
import VideoThumbnailItem from '../../components/CommonComponents/VideoThumbnailItem';

class VideoCollections extends PureComponent {
    constructor(props){
        super(props);
        let list = [];

        this.state = {
            list,
            refreshing : false,
            loadingNext: false
        };
        this.listRef = null;

        const ts = Date.now();
        this.noResultsKeyProp = "video_collection_no_results_" + ts;
        this.hasResultsKeyProp = "video_collection_has_results_" + ts;

        this.numColumns = 2;
        this.flatListKey = this.hasResultsKeyProp;
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
        let fetchUrl = this.props.getFetchUrl();
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
        //this.props.beforeRefresh && this.props.beforeRefresh();
        //this.onPullToRefresh();
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
          onVideoClick={() => {this.onVideoClick(item.payload, index)}}
          isEmpty={item.isEmpty}
          emptyRenderFunction={this.props.getNoResultsCell}/>);
    };


    onVideoClick = (payload, index) => {
        const clonedInstance = this.videoPagination.fetchServices.cloneInstance();
        this.props.navigation.push("FullScreenVideoCollection", {
            fetchServices : clonedInstance,
            currentIndex: index,
            payload,
            baseUrl: this.props.getFetchUrl(),
            showBalanceFlier: this.props.extraParams && this.props.extraParams.showBalanceFlier
        });
    }
    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
    };

    listHeaderComponent = () => {
        return (
          <React.Fragment>
              {this.props.listHeaderComponent}
              {this.state.list.length > 0 && this.props.listHeaderSubComponent }
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
              <FlatList
                ref={this.setListRef}
                ListHeaderComponent={this.listHeaderComponent()}
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

export default VideoCollections  ;
