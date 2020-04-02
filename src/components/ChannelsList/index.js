import React, { PureComponent } from 'react';
import multipleClickHandler from '../../services/MultipleClickHandler';
import {
  FlatList,
  ActivityIndicator,
  Keyboard, 
  View,
  TouchableOpacity,
  Text
} from "react-native";
import { withNavigation } from 'react-navigation';
import SafeAreaView from 'react-native-safe-area-view';

import ChannelCell from '../ChannelCell';
import Pagination from "../../services/Pagination";
import Filters from './Filters';
import inlineStyles from "./styles";
import deepGet from "lodash/get";
import _find from "lodash/find";

class ChannelsList extends PureComponent {
  constructor(props){
    super(props);
    let list = [];
    this.state = {
      list,
      refreshing : false,
      loadingNext: false
    }
    this.listRef = null;
    this.filterRef = null;
    this.currentFilter = {};
    this.setDefaultFilter();
  }

  componentDidMount(){
    this.forcedRefresh();
  }

  componentWillUnmount() {
    this.removePaginationListeners();
    this.listRef = null;
    this.filterRef = null;
  }

  setDefaultFilter = () => {
    const filter = this.props.filters[0];
    if(filter){
      this.currentFilter = filter;
    }
  }

  getCurrentFilter = () => {
    return this.currentFilter;
  }

  setCurrentFilter = (filter) => {
    if(!filter) return;
    this.currentFilter = filter;
  }

  updateFilter = ( filter ) => {
    if(!filter || this.currentFilter.id == filter.id ) return;
    this.setCurrentFilter(filter);
    this.forcedRefresh();
  }

  getPagination = () => {
    return this.channelsPagination;
  };

  initPagination() {
    // First, take care of existing Pagination if exists.
    this.removePaginationListeners();

    // Now, create a new one.
    let fetchUrl = this.props.getFetchUrl( this.currentFilter );
    this.channelsPagination = new Pagination(fetchUrl);
    this.bindPaginationEvents();
  }

  bindPaginationEvents(){
    let pagination = this.getPagination();
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
    let pagination = this.getPagination();
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
    this.channelsPagination = null;
  }

  scrollToTop(){
    this.listRef.scrollToOffset({offset: 0});
  }

  forcedRefresh (){
    this.initPagination();
    this.refresh();
  }

  getResultList(){
    let list = this.getPagination().getResults();
    return list.length > 0 ? list : [this.props.noResultsData];
  }

  beforeRefresh = ( ) => {
    this.props.beforeRefresh && this.props.beforeRefresh();
    let stateObject = {refreshing : true};
    if (this.state.loadingNext) {
      stateObject['loadingNext'] = false;
    }
    this.setState(stateObject);
  }

  onRefresh = ( res ) => {
    const list = this.getResultList() ;
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
    this.getPagination().getNext();
  }

  refresh = () => {
    this.getPagination().refresh();
  }

  _keyExtractor = (item, index) => {
    return `id_${item.id}`
  };

  _renderItem = ({ item, index }) => {
    // Check if this is an empty cell.
    if ( item.isEmpty) {
      // Render no results cell here.
      return this._getNoResultsCell(item);
    } else {
      // Render Channel cell
      return this._renderChannelCell({item,index});
    }
  };

  onChannelPress= (id) =>  {
    this.props.navigation.push("ChannelsScreen", {channelId:id} )
  }

  _renderChannelCell = ({ item, index }) => {
    // isEmpty came from configuration in Search/index.js
    return  <View style={{marginHorizontal: 10, marginTop: 10, marginBottom: 0}}>
              <TouchableOpacity onPress={() => this.onChannelPress(item.id)} activeOpacity={0.9}>
                <ChannelCell channelId={item.id} />
              </TouchableOpacity>
            </View>;
  };

  _getNoResultsCell = (item) => {
    return <React.Fragment> 
            {this.props.getNoResultsCell(item)}
            {this.isSearchInAll() && this.getSearchInAllMarkup()}
          </React.Fragment>
  }

  isSearchInAll  = () => {
    return !!deepGet(this.getPagination().getMeta(), "search_in_all");
  }

  getSearchInAllMarkup = () => {
    return  <TouchableOpacity style={inlineStyles.searchInAllBtn} onPress={multipleClickHandler(() => {this.searchInAllClick()})}>
              <Text style={inlineStyles.searchInAllText}>Search in all communities</Text>
            </TouchableOpacity>
  }

  searchInAllClick = () => {
    this.filterRef && this.filterRef.onFilter(_find(this.props.filters, function(filter) { return filter.id == "all"; }));
  }

  setFilterRef = (ref) => {
    this.filterRef = ref;
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
  }

  setFlatListRef = (ref) => {
    this.listRef = ref;
  }

  onScrollToIndexFailed =( info) => {
    console.log("======onScrollToIndexFailed=====" , info );
  }

  render(){
    return(
      <SafeAreaView forceInset={{ top: 'never' }}>
        <Filters  onRef={this.setFilterRef}
                  filters={this.props.filters} 
                  getCurrentFilter={this.getCurrentFilter} 
                  onChange={this.updateFilter}/>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 60, paddingTop: 0}}
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

ChannelsList.defaultProps = {
  filters: []
}

export default withNavigation(ChannelsList);
