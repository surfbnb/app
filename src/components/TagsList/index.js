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



import Pagination from "../../services/Pagination";
import Colors from "../../theme/styles/Colors";

class TagsList extends PureComponent {
    constructor(props){
        super(props);
        let list = [];
        this.tagsPagination = new Pagination( this.props.getFetchUrl());
        // if (this.shouldMakeApiCall()){
        //     list = this.tagsPagination.getResults();
        // }

        this.setPaginationEvent();

        this.state = {
            list,
            refreshing : false,
            loadingNext: false
        }
        this.listRef = null ;
    }

    shouldMakeApiCall = () =>{
        console.log('shouldMakeApiCall------------------/////////////shouldMakeApiCall------------------/////////////');
        return false;
        console.log('Boolean(this.props.searchParams)', Boolean(this.props.searchParams));
        return Boolean(this.props.searchParams);
    }

    setPaginationEvent(){
        this.paginationEvent = this.tagsPagination.event;
    }

    componentDidMount(){
        this.updatePaginationEvent();

    }

    getEmptyComponent = () => {
        if (this.state.list.length > 0 ){
            return null;
        }
        console.log('getEmptyComponent ----------');
        if (!this.state.refreshing && this.props.searchParams) {
            //if (this.props.noResultsFound && !this.props.toRefresh)
            return this.renderNoResults();
            //}
        }

        if (this.props.searchParams) {
            return this.renderSearchingFor();
        }

        if(!this.props.searchParams){
            return ( <View style={{ flex: 1,flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                <ActivityIndicator style={{alignSelf:'center'}} size="small" color={Colors.greyLite} />
            </View>);
        }

        return <View />;
    };

    renderNoResults() {
        return (
            <View>
                <Text style={{ alignSelf: 'center', color: Colors.greyLite, fontSize: 14, marginTop: 10 }}>
                    No results found!
                </Text>
            </View>
        );
    }


    renderSearchingFor() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <ActivityIndicator size="small" color={Colors.greyLite} />
                <Text style={{ marginLeft: 20, color: Colors.greyLite, fontSize: 14 }}>
                    {`Searching for "${decodeURIComponent(this.props.searchParams) || ''}"`}
                </Text>
            </View>
        );
    }


    updatePaginationEvent(){
        this.paginationEvent.on("onBeforeRefresh" , this.beforeRefresh.bind(this) );
        this.paginationEvent.on("onRefresh" ,  this.onRefresh.bind(this) );
        this.paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this));
        this.paginationEvent.on("onBeforeNext" , this.beforeNext.bind(this));
        this.paginationEvent.on("onNext" , this.onNext.bind(this) );
        this.paginationEvent.on("onNextError" , this.onNextError.bind(this));
        if( this.props.refreshEvent) {
            this.props.refreshEvent.on("refresh" , ()=> {
                this.listRef.scrollToOffset({offset: 0});
                this.refresh();
            });
        }
        this.tagsPagination.initPagination();

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


    forcedRefresh (fetchUrl){
        this.tagsPagination = new Pagination(fetchUrl);
        this.setPaginationEvent();
        this.updatePaginationEvent();
        console.log('forcedRefresh------');
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
        console.log('refreshrefreshrefreshrefresh');
        this.shouldMakeApiCall() && this.tagsPagination.refresh();
    }

    // isCurrentUser = () => {
    //     return this.props.userId === CurrentUser.getUserId();
    // }

    _keyExtractor = (item, index) => `id_${item}`;

    _renderItem = ({ item, index }) => {
        return <Text> {item.text}</Text>;
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

export default  TagsList ;
