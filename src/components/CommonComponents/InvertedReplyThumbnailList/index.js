import React, { Component } from 'react';
import { Text, View, ScrollView, ListView, Dimensions} from 'react-native';
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

  defaultChildClickHandler = ( index )=> {
    const parentVideoId = this.props.videoId,
          parentUserId = this.props.userId,
          clonedInstance = this.getPagination().fetchServices.cloneInstance(),
          navigation = this.props.navigation;
    ReplyHelper.openRepliesList(parentUserId, parentVideoId, clonedInstance, index, navigation);
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

    return <ReplyThumbnailItem payload={item.payload}  onClickHandler={()=>{this.onItemClick(index)}}  />;

  };


  setListRef = (ref) => {
    this.listRef = ref;
  };

  getItemSeperatorComponent = () => {
    return <View style={{backgroundColor: 'white', height: 25, width: 1, alignSelf:'center'}} />
  }

  getListHeight = () => {

    let noOfItems = this.state.list.length ;
    if (this.props.availableHeight > 0 && noOfItems > 0){

      let heightOfElements = noOfItems * 30,
        heightOfSeparator =   (noOfItems - 1 ) * 25,
        availableScreenHeight =  this.props.availableHeight - 50,
        heightOfFlatList = heightOfElements + heightOfSeparator;
      if (availableScreenHeight < heightOfFlatList ){
        return availableScreenHeight;
      }
      return heightOfFlatList;
    }
    return 0;
  };


  render() {
    let height = this.getListHeight();
    return height > 0 ?
      <FlatList style={{ height: height, width: '100%', minHeight:0, flexGrow:0, flexShrink:0}}
        ref={this.setListRef}
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
    />: <React.Fragment />
  }
}

InvertedReplyList.defaultProps = {
  paginationService : null
};

//make this component available to the app
export default withNavigation(InvertedReplyList);
