import React, { PureComponent } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,

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
    }


    getPagination = () => {
        return this.tagsPagination;
    };

    // getEmptyComponent = () => {
    //     if (this.state.list.length > 0 ){
    //         return null;
    //     }
    //     console.log('getEmptyComponent ----------');
    //     if (!this.state.refreshing && this.props.searchParams) {
    //         //if (this.props.noResultsFound && !this.props.toRefresh)
    //         return this.renderNoResults();
    //         //}
    //     }
    //
    //     if (this.props.searchParams) {
    //         return this.renderSearchingFor();
    //     }
    //
    //     if(!this.props.searchParams){
    //         return ( <View style={{ flex: 1,flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
    //             <ActivityIndicator style={{alignSelf:'center'}} size="small" color={Colors.greyLite} />
    //         </View>);
    //     }
    //
    //     return <View />;
    // };

    // renderNoResults() {
    //     return (
    //         <View>
    //             <Text style={{ alignSelf: 'center', color: Colors.greyLite, fontSize: 14, marginTop: 10 }}>
    //                 No results found!
    //             </Text>
    //         </View>
    //     );
    // }


    // renderSearchingFor() {
    //     return (
    //         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
    //             <ActivityIndicator size="small" color={Colors.greyLite} />
    //             <Text style={{ marginLeft: 20, color: Colors.greyLite, fontSize: 14 }}>
    //                 {`Searching for "${decodeURIComponent(this.props.searchParams) || ''}"`}
    //             </Text>
    //         </View>
    //     );
    // }



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
    }





    forcedRefresh (fetchUrl){
        this.initPagination();
        this.refresh();
    }


    // onPullToRefresh = () => {
    //     fetchUser(this.props.userId , this.onUserFetch );
    // }
    //
    // onUserFetch =(res) => {
    //     this.props.onUserFetch && this.props.onUserFetch(res);
    // }

    beforeRefresh = ( ) => {
        //this.props.beforeRefresh && this.props.beforeRefresh();
        //this.onPullToRefresh();
        this.setState({ refreshing : true });
    }

    onRefresh = ( res ) => {
        const list = this.tagsPagination.getResults()  ;
        console.log('onRefresh',res);
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
        this.setState({ loadingNext : false ,  list : this.tagsPagination.getResults() });
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

    _keyExtractor = (item, index) => `id_${item}`;

    _renderItem = ({ item, index }) => {
        console.log('itemmmmmmm', item);
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

    render(){
        return(
            <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
                <FlatList
                    ref={(ref)=>  {this.listRef = ref } }
                    // style={{backgroundColor: 'red'}}
                    //ListHeaderComponent={this.listHeaderComponent()}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    onRefresh={this.refresh}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={9}
                    renderItem={this._renderItem}
                    //ListFooterComponent={this.renderFooter}
                    // numColumns={3}
                />
            </SafeAreaView>
        );
    }

}

export default  TagsList;
