import React, { PureComponent } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Keyboard
} from "react-native";
import SafeAreaView from 'react-native-safe-area-view';

import PeopleCell from './PeopleCell';

import Pagination from "../../services/Pagination";
import Colors from "../../theme/styles/Colors";
import User from "../Users/User";

class PeopleList extends PureComponent {
  constructor(props){
    super(props);
    let list = [];
    // this.peoplePagination = new Pagination( this.props.getFetchUrl());

    this.state = {
      list,
      refreshing : false,
      loadingNext: false
    };
    this.listRef = null;
  }


  componentDidMount(){
    this.forcedRefresh();
  }

  componentWillUnmount() {
    this.removePaginationListeners();
  }

  getPagination = () => {
    return this.peoplePagination;
  };

  // region - Pagination and Event Handlers

  initPagination() {
    // First, take care of existing Pagination if exists.
    this.removePaginationListeners();

    // Now, create a new one.
    let fetchUrl = this.props.getFetchUrl();
    this.peoplePagination = new Pagination(fetchUrl);
    this.bindPaginationEvents();
  }

  bindPaginationEvents(){
    let pagination = this.peoplePagination;
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
    let pagination = this.peoplePagination;
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
    this.peoplePagination = null;
  }

  scrollToTop(){
    this.listRef.scrollToOffset({offset: 0});
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
    let stateObject = {refreshing : true};
    if (this.state.loadingNext) {
      stateObject['loadingNext'] = false;
    }
    this.setState(stateObject);
  };

  onRefresh = ( res ) => {
    let results = this.peoplePagination.getResults()  ;
    if ( !results || results.length < 1) {
      // Create data for empty list.
      results = [ this.props.noResultsData ];
    }

    this.props.onRefresh && this.props.onRefresh( results , res );
    this.setState({ refreshing : false , list : results });
  }

  onRefreshError = ( error ) => {
    this.setState({ refreshing : false });
  }

  beforeNext =() => {
    if (this.state.refreshing) return;
    this.setState({ loadingNext : true });
  }

  onNext = ( res  ) => {
    this.setState({ loadingNext : false ,  list : this.peoplePagination.getResults() });
  }

  onNextError = ( error ) => {
    this.setState({ loadingNext : false });
  }

  getNext = () => {
    this.peoplePagination.getNext();
  }

  refresh = () => {
    this.peoplePagination.refresh();
  };

  // isCurrentUser = () => {
  //     return this.props.userId === CurrentUser.getUserId();
  // }

  _keyExtractor = (item, index) => {
    return `id_${item.id}`;
  };

  _renderItem = ({item, index}) => {
    // Check if this is an empty cell.
    if ( item.isEmpty) {
      // Render no results cell here.
      return this.props.getNoResultsCell(item);
    } else {
      // Render People cell
      return this._renderPeopleCell({item,index});
    }
  };

  _renderPeopleCell = ({ item, index }) => {
    return <PeopleCell
            userId={item.payload.user_id}
            isEmpty={item.isEmpty}
            emptyRenderFunction={this.props.getNoResultsCell}
            />;
  };

  renderFooter = () => {
    console.log(this.state.loadingNext, 'this.state.loadingNext ----------- this.state.loadingNext -----------');
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

  onScrollToIndexFailed =( info) => {
    console.log("======onScrollToIndexFailed=====" , info );
  }

  render(){
    return(
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
        <FlatList
          ref={(ref)=>  {this.listRef = ref } }
          //ListHeaderComponent={this.listHeaderComponent()}
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
          // numColumns={3}
        />
      </SafeAreaView>
    );
  }

}

export default  PeopleList ;
