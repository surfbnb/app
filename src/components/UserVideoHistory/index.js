import React , {PureComponent} from "react"; 
import {View , FlatList} from "react-native";
import deepGet from "lodash/get";
import reduxGetters from "../../services/ReduxGetters";
import Pricer from "../../services/Pricer";
import Pagination from "../../services/Pagination";

import UserVideoHistoryRow from "./UserVideoHistoryRow";

import inlineStyles from "./styles";

const maxVideosThreshold = 3;

class UserVideoHistoryScreen extends PureComponent{

    static navigationOptions = (options) => {
        return {
          header: null
        };
    };

    constructor(props){
        super(props); 
        this.userId =  this.props.navigation.getParam("userId") ;
        this.videoHistoryPagination = new Pagination( this._fetchUrlVideoHistory() );
        this.paginationEvent = this.videoHistoryPagination.event;
        this.currentIndex =  0 ;// this.props.navigation.getParam("currentIndex");
       
        this.state = {
            list : this.props.navigation.getParam("initialList") || [],
            refreshing : false, 
            loadingNext: false,
            activeIndex: this.currentIndex,
            pagingEnabled: false
        }
    }

    _fetchUrlVideoHistory(){
        return `/users/${this.userId}/video-history` ; 
    }

    componentDidMount(){
        this.paginationEvent.on("beforeRefresh" ,  this.beforeRefresh.bind(this) );
        this.paginationEvent.on("onRefresh" , this.onRefresh.bind(this) );
        this.paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this)  );
        this.paginationEvent.on("beforeNext" ,  this.beforeNext.bind(this) );
        this.paginationEvent.on("onNext" , this.onNext.bind(this) );
        this.paginationEvent.on("onNextError" , this.onNextError.bind(this) );
        this.videoHistoryPagination.initPagination();
        this.setState({ pagingEnabled: true});
    }

    componentWillUnmount(){
        this.paginationEvent.removeListener('beforeRefresh');
        this.paginationEvent.removeListener('onRefresh');
        this.paginationEvent.removeListener('onRefreshError');
        this.paginationEvent.removeListener('beforeNext');
        this.paginationEvent.removeListener('onNext');
        this.paginationEvent.removeListener('onNextError');
    }

    getVideoBtAmount(videoId){
        return Pricer.getToBT( Pricer.getFromDecimal( reduxGetters.getVideoBt(videoId) ) ) ; 
    }

    
    beforeRefresh = ( ) => {
        this.setState({ refreshing : true }); 
    }

    onRefresh = ( res ) => {
        this.setState({ refreshing : false ,  list : this.videoHistoryPagination.list }); 
    }

    onRefreshError = ( error ) => {
        this.setState({ refreshing : false });
    }

    beforeNext =() => {
        this.setState({ loadingNext : true }); 
    }

    onNext = ( res  ) => {
        this.setState({ loadingNext : false ,  list : this.videoHistoryPagination.list }); 
    }

    onNextError = ( error ) => {
        this.setState({ loadingNext : false }); 
    }

    getNext = () => {
      this.videoHistoryPagination.getNext();
    }

    refresh = () => {
      this.videoHistoryPagination.refresh();
    }

    _keyExtractor = (item, index) => {
        return `id_${item}`;
    };

    _renderItem = ({ item, index }) => {
        console.log("_renderItem = index = " , index  );
        const videoId = reduxGetters.getUserVideoId(item) ;
        return  <UserVideoHistoryRow    isActive={index == this.state.activeIndex}
                                        doRender={Math.abs(index - this.currentIndex) < maxVideosThreshold}
                                        userId={this.userId} videoId={videoId}  /> ;
    };

    onViewableItemsChanged = (data) => {
        this.currentIndex = deepGet(data, 'viewableItems[0].index') ||  this.currentIndex;
        console.log("====onViewableItemsChanged====" , this.currentIndex, "data", data);
    }
    
    setActiveIndex() {
        this.setState({ activeIndex: this.currentIndex });
    }

    onMomentumScrollEndCallback = () => {
        this.setActiveIndex();
    };
    
    onScrollToIndexFailed =( info) => {
        console.log("======onScrollToIndexFailed=====" , info );  
    }

    getItemLayout= (data, index) => {
        const layoutConfig = {length: inlineStyles.fullScreen.height, offset: inlineStyles.fullScreen.height * index, index} ; 
        console.log("getItemLayout = index = layoutConfig = " , index , layoutConfig );
        return layoutConfig ;
    }
       
    render() {
        return(
                <FlatList  
                    snapToAlignment={"top"}
                    viewabilityConfig={{itemVisiblePercentThreshold: 90}}
                    pagingEnabled={this.state.pagingEnabled}
                    decelerationRate={"normal"}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    onRefresh={this.refresh}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={7}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    onMomentumScrollEnd={this.onMomentumScrollEndCallback}
                    renderItem={this._renderItem}
                    style={inlineStyles.fullScreen}
                    showsVerticalScrollIndicator={false}

                    //initialScrollIndex={this.state.activeIndex}
                    //getItemLayout={this.getItemLayout}
                    //onScrollToIndexFailed={this.onScrollToIndexFailed}
                />
        );
    }

}

export default UserVideoHistoryScreen ; 