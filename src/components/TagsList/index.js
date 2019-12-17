import React, { PureComponent } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator, Keyboard,

} from "react-native";
import {SafeAreaView, withNavigation} from "react-navigation";

import TagsCell from './TagsCell';

import Pagination from "../../services/Pagination";
import Colors from "../../theme/styles/Colors";

class TagsList extends PureComponent {
    constructor(props){
        super(props);
        let list = [];
        // this.tagsPagination = new Pagination( this.props.getFetchUrl());

        this.state = {
            list,
            refreshing : false,
            loadingNext: false
        }
        this.listRef = null ;
    }


    componentDidMount(){
        this.forcedRefresh();
    }

    componentWillUnmount() {
        this.removePaginationListeners();
        this.listRef = null;
    }


    getPagination = () => {
        return this.tagsPagination;
    };


    // region - Pagination and Event Handlers

    initPagination() {
        // First, take care of existing Pagination if exists.
        this.removePaginationListeners();

        // Now, create a new one.
        let fetchUrl = this.props.getFetchUrl();
        this.tagsPagination = new Pagination(fetchUrl);
        this.bindPaginationEvents();
    }

    bindPaginationEvents(){
        let pagination = this.tagsPagination;
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
        let pagination = this.tagsPagination;
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
        this.tagsPagination = null;
    }

    scrollToTop(){
        this.listRef.scrollToOffset({offset: 0});
    }


    forcedRefresh (fetchUrl){
        this.initPagination();
        this.refresh();
    }


    getResultList(){
        let list = this.tagsPagination.getResults();
        return list.length > 0 ? list : [this.props.noResultsData];
    }


    beforeRefresh = ( ) => {
        //this.props.beforeRefresh && this.props.beforeRefresh();
        //this.onPullToRefresh();
        let stateObject = {refreshing : true};
        if (this.state.loadingNext) {
            stateObject['loadingNext'] = false;
        }
        this.setState(stateObject);
    }

    onRefresh = ( res ) => {
        const list = this.getResultList() ;
        console.log('onRefresh',res);
        this.props.onRefresh && this.props.onRefresh( list , res );
        this.setState({ refreshing : false , list : list });
    }

    onRefreshError = ( error ) => {
        this.setState({ refreshing : false });
    }

    beforeNext =() => {
        if (this.state.refreshing) return;
        this.setState({ loadingNext : true });
    }

    onNext = ( res  ) => {
        this.setState({ loadingNext : false ,  list : this.getResultList() });
    }

    onNextError = ( error ) => {
        this.setState({ loadingNext : false });
    }

    getNext = () => {
        this.tagsPagination.getNext();
    }

    refresh = () => {
        this.tagsPagination.refresh();
    }

    // isCurrentUser = () => {
    //     return this.props.userId === CurrentUser.getUserId();
    // }

    _keyExtractor = (item, index) => {
        return `id_${item.id}`
    };

    _renderItem = ({ item, index }) => {
      // Check if this is an empty cell.
      if ( item.isEmpty) {
        // Render no results cell here.
        return this.props.getNoResultsCell(item);
      } else {
        // Render Tag cell
        return this._renderTagCell({item,index});
      }
    };

    _renderTagCell = ({ item, index }) => {
        // isEmpty came from configuration in Search/index.js
        return <TagsCell text={item.text} tagId={item.id} />;
    };

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
    }

    setFlatListRef = (ref) => {
        this.listRef = ref;
    }

    onScrollToIndexFailed =( info) => {
        console.log("======onScrollToIndexFailed=====" , info );
      }

    render(){
        return(
            <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
                <FlatList
                    ref={this.setFlatListRef}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    onRefresh={this.refresh}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={9}
                    renderItem={this._renderItem}
                    onScrollBeginDrag={() => Keyboard.dismiss()}
                    keyboardShouldPersistTaps={'always'}
                    ListFooterComponent={this.renderFooter}
                    onScrollToIndexFailed={this.onScrollToIndexFailed}
                />
            </SafeAreaView>
        );
    }

}

export default  TagsList;
