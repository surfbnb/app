import React, { Component } from 'react';
import { View, ScrollView} from 'react-native';
import { withNavigation } from 'react-navigation';

import Pagination from "../../../services/Pagination";
import ReplyThumbnailItem from './ReplyThumbnailItem'
import {FlatList} from 'react-native-gesture-handler';
import ReplyHelper from '../../../helpers/ReplyHelper';

class InvertedReplyList extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      refreshing : false,
      loadingNext: false
    };
    this.listRef = null;
    this.onItemClick = null;
    this.invertedlistPagination = null;
  }

  setClickHandlers = ()=> {
    this.onItemClick = this.props.onChildClickDelegate || this.defaultChildClickHandler;
  }

  defaultChildClickHandler = ( index )=> {
    const parentVideoId = this.props.videoId,
          parentUserId = this.props.userId,
          clonedInstance = this.invertedlistPagination.fetchServices.cloneInstance(),
          navigation = this.props.navigation;
    ReplyHelper.openRepliesList(parentUserId, parentVideoId, clonedInstance, index, navigation);
  };

  componentWillUnmount() {
    this.removePaginationListeners();
    this.onItemClick = ()=> {};
  }

  getPagination = () => {
    return this.invertedlistPagination;
  };

  getFetchUrl = () => {
    // return `/videos/${3847}/replies`;
    return `/videos/${this.props.videoId}/replies`;
  };

  // region - Pagination and Event Handlers

  initPagination() {
    // First, take care of existing Pagination if exists.
    this.removePaginationListeners();
    console.log('initPagination');
    // Now, create a new one.
    let fetchUrl = this.getFetchUrl();
    console.log('fetchUrl',fetchUrl);
    this.invertedlistPagination = new Pagination(fetchUrl);
    this.bindPaginationEvents();
  }

  bindPaginationEvents(){
    let pagination = this.invertedlistPagination;
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
    let pagination = this.invertedlistPagination;
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
    this.invertedlistPagination = null;
  }

  scrollToTop(){
    this.listRef.scrollToOffset({offset: 0});
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
    let results = this.invertedlistPagination.getResults()  ;
    // if ( !results || results.length < 1) {
    //   // Create data for empty list.
    //   results = [ this.props.noResultsData ];
    // }

    this.props.onRefresh && this.props.onRefresh( results , res );
    this.setState({ refreshing : false , list : results });
    // this.setState({ refreshing : false , list :[results[0], results[1]]  });
    this.setState({ refreshing : false });
  }

  onRefreshError = ( error ) => {
    this.setState({ refreshing : false });
  }

  beforeNext =() => {
    if (this.state.refreshing) return;
    this.setState({ loadingNext : true });
  }

  onNext = ( res  ) => {
    this.setState({ loadingNext : false ,  list : this.invertedlistPagination.getResults() });
  }

  onNextError = ( error ) => {
    this.setState({ loadingNext : false });
  }

  getNext = () => {
    this.invertedlistPagination.getNext();
  }

  refresh = () => {
    this.invertedlistPagination.refresh();
  };

  // isCurrentUser = () => {
  //     return this.props.userId === CurrentUser.getUserId();
  // }

  _keyExtractor = (item, index) => {
    return `id_${item.id}`;
  };

  _renderItem = ({item, index}) => {
    // Check if this is an empty cell.
    return <ReplyThumbnailItem payload={item.payload} parentUserId={this.props.userId} onClickHandler={()=>{this.onItemClick(index)}} />;
    // if ( item.isEmpty) {
    //   // Render no results cell here.
    //   return this.props.getNoResultsCell(item);
    // } else {
    //   // Render People cell
    //   return this._renderThumbnailCell({item,index});
    // }
  };


  setListRef = (ref) => {
    this.listRef = ref;
  };

  componentDidMount () {
    console.log('InvertedReplyList::InvertedReplyListcomponentDidMount');
    this.initPagination();
    this.refresh();
    this.setClickHandlers();
  }

  listHeaderComponent = () => {
      if (this.props.HeaderComponent){
        let HeaderComponent = this.props.HeaderComponent;
        return <HeaderComponent onClickHandler={this.onParentClick}/>
      }
  };

  getItemSeperatorComponent = () => {
    return <View style={{backgroundColor: 'white', height: 25, width: 1, alignSelf:'center'}} />
  }

  render() {

    return <ScrollView style={{height: 500, width:'100%'}}>
     <FlatList
    style={{height: '100%', width: '100%'}}
    ref={this.setListRef}
    ListHeaderComponent={this.listHeaderComponent()}
    ItemSeparatorComponent={this.getItemSeperatorComponent}
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
    nestedScrollEnabled={true}
    />
</ScrollView>

  }
}

//make this component available to the app
export default withNavigation(InvertedReplyList);
