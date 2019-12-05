import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import deepGet from "lodash/get";

import Pagination from "../../../services/Pagination";
import ReplyThumbnailItem from './ReplyThumbnailItem'
import {FlatList} from 'react-native-gesture-handler';
import ReplyHelper from '../../../helpers/ReplyHelper';
import AppConfig from "../../../constants/AppConfig";
import DataContract from '../../../constants/DataContract';
import ReduxGetters from '../../../services/ReduxGetters';
import Utilities from '../../../services/Utilities';


const ITEM_HEIGHT = AppConfig.thumbnailListConstants.cellHeight();
const ITEM_SEPERATOR_HEIGHT = AppConfig.thumbnailListConstants.separatorHeight;

class InvertedReplyList extends PureComponent {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.paginationService = null;
    this.hasInitialData =  true;
    this.setPagination();

    this.state = {
      list: this.getInitialList(),
      refreshing : false,
      loadingNext: false
    };

    this.listRef = null;
    this.onItemClick = null;
  }

  getInitialList = () => {
    if (this.props.paginationService){
      return this.paginationService.getResults();
    }
    return [];
  };

  setClickHandlers = ()=> {
    this.onItemClick = this.props.onChildClickDelegate;
  };

  getPagination = () => {
    return this.paginationService;
  };

  componentDidMount () {
    this.bindPaginationEvents();
    this.setClickHandlers();
  }

  setPagination() {
    let fetchUrl = this.getFetchUrl();
    this.paginationService = this.props.paginationService;
    if( !this.paginationService || !( this.paginationService instanceof  Pagination)){
      this.paginationService = new Pagination(fetchUrl);
      if( this.props.doRender ){
        this.initPagination();
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
      this.listRef && this.listRef.scrollToIndex({index : this.props.currentIndex, viewOffset: 100, viewPosition: 0.5});
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
    return DataContract.replies.getReplyListApi(this.props.videoId);
  };

  scrollToTop(){
    this.listRef.scrollToOffset({offset: 0});
  }

  beforeRefresh = ( ) => {
    console.log('beforeRefresh')
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
              <ReplyThumbnailItem
                payload={item.payload}
                onClickHandler={()=>{this.onItemClick(index, item)}}
                isActive={this.isActiveEntity( index , item)}
                cellIndex={index}
                totalCells={this.state.list.length}
              />
          </View>;
  };

  isActiveEntity = ( index , item )=>{
    if(typeof this.props.isActiveEntity == "function" ){
      return this.props.isActiveEntity(this.props.fullVideoReplyId , item , index) ;
    }
    return this.props.currentIndex == index;
  }

  setListRef = (ref) => {
    this.listRef = ref;
  };

  getItemSeperatorComponent = ({leadingItem}) => {
    let styles = {
      backgroundColor: AppConfig.thumbnailListConstants.separatorColor,
      height: AppConfig.thumbnailListConstants.separatorHeight,
      width: AppConfig.thumbnailListConstants.separatorWidth,
      alignSelf:'center'
    };

    const separatorMargin = AppConfig.thumbnailListConstants.separatorMargin();

    // Leading Item
    let leadingItemIndex = this.state.list.indexOf(leadingItem);
    let isLeadingSelected = this.isActiveEntity( leadingItemIndex , leadingItem);
    let isLeadingSeen = ReduxGetters.isReplySeen( deepGet(leadingItem.payload,'reply_detail_id'));

    //Top margin is needed if and only if the leading cell is seen and is not selected.
    if ( isLeadingSeen && !isLeadingSelected ) {
      //Leading does not have border.
      styles.marginTop = -1 * separatorMargin;
      styles.height = styles.height + separatorMargin;
    }

    let trailingItemIndex = leadingItemIndex + 1;
    let trailingItem = this.state.list[trailingItemIndex];
    let isTrailingSelected = this.isActiveEntity( trailingItemIndex , trailingItem);
    let isTrailingSeen = ReduxGetters.isReplySeen( deepGet(trailingItem.payload,'reply_detail_id'));

    //Bottom margin is needed if and only if the trailing cell is seen and is not selected.
    if ( isTrailingSeen && !isTrailingSelected ) {
      //Trailing cell does not have border.
      styles.marginBottom = -1 * separatorMargin;
      styles.height = styles.height + separatorMargin;
    }

    return <View style={styles} />
  };

  getAvailableHeight = () => {
    let availableHeight = Utilities.getPendantAvailableHeight();
    return availableHeight - this.props.bottomRounding;
  }

  getListHeight = () => {
    let availableHeight = this.getAvailableHeight();
    let noOfItems = this.state.list.length;
    if (noOfItems > 0){
      let heightOfElements = noOfItems * ITEM_HEIGHT,
        heightOfSeparator =   (noOfItems - 1 ) *  AppConfig.thumbnailListConstants.separatorHeight,
        heightOfFlatList = heightOfElements + heightOfSeparator ,
        finalHeight = availableHeight > heightOfFlatList ? heightOfFlatList : availableHeight;
      return finalHeight;
    }
    return 0;
  };

  getItemLayout= (data, index) => {
    let itemLength = ITEM_SEPERATOR_HEIGHT + ITEM_HEIGHT;
    let itemOffset = index * (itemLength);
    return {
      length: itemLength,
      offset: itemOffset,
      index: index
    };
  }

  render() {
      console.log("InvertedReplyList :: this.props.listKey", this.props.listKey);
        return   <FlatList style={{ height: this.getListHeight(), width: '100%' , position: "absolute" , bottom: this.props.bottomRounding}}
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
        key={this.flatListKey}
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
  bottomRounding: 10
};

//make this component available to the app
export default withNavigation(InvertedReplyList);
