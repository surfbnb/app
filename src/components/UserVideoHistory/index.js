import React , {PureComponent} from "react"; 
import {FlatList} from "react-native";
import deepGet from "lodash/get";
import reduxGetters from "../../services/ReduxGetters";
import Pricer from "../../services/Pricer";

import UserVideoHistoryRow from "./UserVideoHistoryRow";


const maxVideosThreshold = 3;

class UserVideoHistoryScreen extends PureComponent{

    static navigationOptions = (options) => {
        return {
          header: null
        };
    };

    constructor(props){
        super(props); 
        this.videoHistoryPagination = this.props.navigation.getParam("videoHistoryPagination"); 
        this.paginationEvent = this.videoHistoryPagination.event ; 
        this.currentIndex =  this.props.navigation.getParam("currentIndex");
        this.userId =  this.props.navigation.getParam("userId") ;

        this.state = {
            list : this.videoHistoryPagination.list,
            refreshing : false, 
            loadingNext: false,
            activeIndex: this.currentIndex,
            pagingEnabled: false
        }
    }

    componentDidMount(){
        this.paginationEvent.on("beforeRefresh" , this.beforeRefresh );
        this.paginationEvent.on("onRefresh" , this.onRefresh );
        this.paginationEvent.on("onRefreshError" , this.onRefreshError );
        this.paginationEvent.on("beforeNext" , this.beforeNext );
        this.paginationEvent.on("onNext" , this.onNext );
        this.paginationEvent.on("onNextError" , this.onNextError );
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

    render(){
        return(
            <FlatList  
                snapToAlignment={"top"}
                viewabilityConfig={{ waitForInteraction: true, itemVisiblePercentThreshold: 90}}
                pagingEnabled={true}
                decelerationRate={"fast"}
                data={this.state.list}
                onEndReached={this.getNext}
                onRefresh={this.refresh}
                keyExtractor={this._keyExtractor}
                refreshing={this.state.refreshing}
                initialScrollIndex={this.state.activeIndex}
                onEndReachedThreshold={7}
                onScrollToIndexFailed={this.onScrollToIndexFailed}
                onViewableItemsChanged={this.onViewableItemsChanged}
                onMomentumScrollEnd={this.onMomentumScrollEndCallback}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
            />
        );
    }

}

export default UserVideoHistoryScreen ; 