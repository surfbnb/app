import React , {PureComponent} from "react"; 
import {View, Text , FlatList} from "react-native";
import deepGet from "lodash/get";
import reduxGetters from "../../services/ReduxGetters";
import Pricer from "../../services/Pricer";

import UserVideoHistoryRow from "./UserVideoHistoryRow";

import inlineStyles from './styles';

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
        this.currentIndex =  this.props.navigation.getParam("currentIndex") || 0;
        this.userId =  this.props.navigation.getParam("userId") || 0;

        console.log("this.videoHistoryPagination.list", this.videoHistoryPagination.list);
        this.state = {
            list : this.videoHistoryPagination.list,
            refreshing : false, //TODO ask
            loadingNext: false, //TODO ask
            activeIndex: this.currentIndex,
            pagingEnabled: false
        }
    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({pagingEnabled: true});
        },10)
    }

    getVideoBtAmount(videoId){
        return Pricer.getToBT( Pricer.getFromDecimal( reduxGetters.getVideoBt(videoId) ) ) ; 
    }

    //TODO
    // beforeRefresh = ( ) => {
    //     this.setState({ refreshing : true }); 
    // }

    // onRefresh = ( res ) => {
    //     this.setState({ refreshing : false ,  list : this.videoHistoryPagination.list }); 
    // }

    // onRefreshError = ( error ) => {
    //     this.setState({ refreshing : false });
    // }

    // beforeNext =() => {
    //     this.setState({ loadingNext : true }); 
    // }

    // onNext = ( res  ) => {
    //     this.setState({ loadingNext : false ,  list : this.videoHistoryPagination.list }); 
    // }

    // onNextError = ( error ) => {
    //     this.setState({ loadingNext : false }); 
    // }

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
        // console.log("_renderItem called for index", index, "item", item);
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

    temp = (data, index) => {
        let x =  {
            length: inlineStyles.fullScreen.height, 
            offset: inlineStyles.fullScreen.height * index, 
            index
        };
        console.log("x", x, "index", index);
        return x;
    };

    render(){
        return(
            <FlatList  
                snapToAlignment={"top"}
                viewabilityConfig={{ waitForInteraction: true, itemVisiblePercentThreshold: 90}}
                pagingEnabled={this.state.pagingEnabled}
                decelerationRate={"fast"}
                data={this.state.list}
                onEndReached={this.getNext}
                keyExtractor={this._keyExtractor}
                refreshing={this.state.refreshing}
                initialNumToRender={maxVideosThreshold}
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