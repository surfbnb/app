import React, { Component } from 'react';
import { Text, View, ScrollView, ListView, Dimensions} from 'react-native';
import { withNavigation } from 'react-navigation';

import Pagination from "../../../services/Pagination";
import ReplyThumbnailItem from './ReplyThumbnailItem'
import {FlatList} from 'react-native-gesture-handler';
import ReplyHelper from '../../../helpers/ReplyHelper';
import AppConfig from "../../../constants/AppConfig";
import DataContract from '../../../constants/DataContract';

//
const ITEM_HEIGHT = AppConfig.thumbnailListConstants.iconHeight +  AppConfig.thumbnailListConstants.iconWidth;

class InvertedReplyList extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.paginationService = null;
    this.hasInitialData =  true;
    this.setPagination();

    this.state = {
      list: this.paginationService.getResults(),
      refreshing : false,
      loadingNext: false
    };

    this.listRef = null;
    this.onItemClick = null;
  }

  setClickHandlers = ()=> {
    this.onItemClick = this.props.onChildClickDelegate || this.defaultChildClickHandler;
  }

  getPagination = () => {
    return this.paginationService;
  };

  componentDidMount () {
    this.bindPaginationEvents();
    this.setClickHandlers();
  }

  defaultChildClickHandler = ( index, item )=> {
    const baseUrl = DataContract.replies.getReplyListApi(this.props.videoId),
          clonedInstance = this.getPagination().fetchServices.cloneInstance();
    ReplyHelper.updateEntitySeen( item );
    this.props.navigation.push('FullScreenReplyCollection',{
      "fetchServices": clonedInstance,
      "currentIndex":index,
      "baseUrl": baseUrl
    });
  };

  setPagination() {
    let fetchUrl = this.getFetchUrl();
    this.paginationService = this.props.paginationService;
    if( !this.paginationService || !( this.paginationService instanceof  Pagination)){
      this.paginationService = new Pagination(fetchUrl);
      if( this.props.doRender ){
        this.initPagination()
      }else {
        //Load data later
        this.hasInitialData = false;
      }
    }
  }

  componentWillUnmount() {
    this.removePaginationListeners();
    this.onItemClick = ()=> {};
  }

  componentDidUpdate(prevProps, prevState ) {
    if( this.props.doRender && this.props.doRender !== prevProps.doRender &&  !this.hasInitialData  ){
      this.initPagination();
    }
    if(this.props.currentIndex != prevProps.currentIndex){
      this.listRef && this.listRef.scrollToIndex({index : this.props.currentIndex, viewOffset: 100, viewPosition: 0});
    }
  }

  onScrollToIndexFailed =( info) => {
    console.log("======onScrollToIndexFailed=====" , info );
  }

  // region - Pagination and Event Handlers

  initPagination(){
    this.getPagination().initPagination();
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
  }

  getFetchUrl = () => {
    return `/videos/${this.props.videoId}/replies`;
  };

  scrollToTop(){
    this.listRef.scrollToOffset({offset: 0});
  }

  beforeRefresh = ( ) => {
    this.props.beforeRefresh && this.props.beforeRefresh();
    let stateObject = {refreshing : true};
    if (this.state.loadingNext) {
      stateObject['loadingNext'] = false;
    }
    this.setState(stateObject);
  };

  onRefresh = ( res ) => {
    let results = this.getPagination().getResults()  ;
    this.props.onRefresh && this.props.onRefresh( results , res );
    this.setState({ refreshing : false , list : results });
    // this.setState({ refreshing : false , list : [results[0], results[1]] });
  }

  onRefreshError = ( error ) => {
    this.setState({ refreshing : false });
  }

  beforeNext =() => {
    if (this.state.refreshing) return;
    this.setState({ loadingNext : true });
  }

  onNext = ( res  ) => {
    this.setState({ loadingNext : false ,  list : this.getPagination().getResults() });
  }

  onNextError = ( error ) => {
    this.setState({ loadingNext : false });
  }

  getNext = () => {
    this.getPagination().getNext();
  }

  refresh = () => {
    this.getPagination().refresh();
  };

  _keyExtractor = (item, index) => {
    return `id_${item.id}`;
  };

  _renderItem = ({item, index}) => {

    return <View style={{alignSelf:'center'}}>
              <ReplyThumbnailItem payload={item.payload} onClickHandler={()=>{this.onItemClick(index, item)}} isActive={()=>{return this.isActive( index )} }/>
          </View>;

  };

  isActive = ( index )=>{
    return this.props.showActiveIndicator && this.props.currentIndex == index;
  }

  setListRef = (ref) => {
    this.listRef = ref;
  };

  getItemSeperatorComponent = () => {
    return <View style={{backgroundColor: 'white', height: AppConfig.thumbnailListConstants.separatorHeight, width: 1, alignSelf:'center'}} />
  };

  getAvailableHeight = () => {
    const area = AppConfig.MaxDescriptionArea;
    let height = ( area / Dimensions.get('window').width ) + 20,
      //70 is height of top section
      availableHeight =   AppConfig.VideoScreenObject.height - height - 70 ;
    return this.props.parentIconHeight ? availableHeight - this.props.parentIconHeight : availableHeight;
  }


  getListHeight = () => {
    let availableHeight = this.getAvailableHeight();
    let noOfItems = this.state.list.length;
    if (noOfItems > 0){
      let heightOfElements = noOfItems * AppConfig.thumbnailListConstants.iconHeight,
        heightOfSeparator =   (noOfItems - 1 ) *  AppConfig.thumbnailListConstants.separatorHeight,
        heightOfFlatList = heightOfElements + heightOfSeparator;
      return availableHeight > heightOfFlatList ? heightOfFlatList : availableHeight;
    }
    return availableHeight;
  };

  getItemLayout= (data, index) => {
    return {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index} ;
  }

  render() {
      console.log("InvertedReplyList :: this.props.listKey", this.props.listKey);
        return   <FlatList style={{ height: this.getListHeight(), width: '100%'}}
        ref={this.setListRef}
        ItemSeparatorComponent={this.getItemSeperatorComponent}
        data={this.state.list}
        listKey={this.props.listKey}
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
        showsVerticalScrollIndicator={false}
        initialScrollIndex={this.props.currentIndex}
        getItemLayout={this.getItemLayout}
        onScrollToIndexFailed={this.onScrollToIndexFailed}
    />
  }
}

InvertedReplyList.defaultProps = {
  paginationService : null,
  doRender: true,
  currentIndex: 0,
  showActiveIndicator: false
};

//make this component available to the app
export default withNavigation(InvertedReplyList);
