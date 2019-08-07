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

        console.log("this.currentIndex===" , this.currentIndex);
        console.log("this.userId===" , this.userId);

        this.state = {
            list : this.videoHistoryPagination.list,
            refreshing : false, 
            loadingNext: false,
            activeIndex: this.currentIndex,
            pagingEnabled: false
        }
    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({pagingEnabled: true});
        },10)
    }

    _fetchUrlVideoHistory(){
        if(!this.props.userId){  return null }
        return `/users/${this.props.userId}/video-history` ; 
    }

    getVideoBtAmount(videoId){
        Pricer.getToBT( Pricer.getFromDecimal( reduxGetters.getVideoBt(videoId) ) ) ; 
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

    onViewableItemsChanged(data) {
        this.currentIndex = deepGet(data, 'viewableItems[0].index') || this.currentIndex;
        console.log("this.currentIndex onViewableItemsChanged===" , this.currentIndex);
    }
    
    setActiveIndex() {
        if (this.state.activeIndex == this.currentIndex) return;
        this.setState({ activeIndex: this.currentIndex });
        console.log("activeIndex setActiveIndex===" , this.state.activeIndex);
    }

    _keyExtractor = (item, index) => `id_${item}`;

    _renderItem = ({ item, index }) => {
        const videoId = reduxGetters.getUserVideoId(item) ;
        console.log("=====_renderItem start ======"); 
        console.log("index" , index);
        console.log("this.state.activeIndex" , this.state.activeIndex); 
        console.log("this._renderItem index == this.state.activeIndex===" , index == this.state.activeIndex);
        console.log("this._renderItem Math.abs(index - this.state.activeIndex) < maxVideosThreshold===" , Math.abs(index - this.state.activeIndex) < maxVideosThreshold);
        console.log("=====_renderItem end ======"); 
        return  <UserVideoHistoryRow    isActive={index == this.state.activeIndex}
                                        doRender={Math.abs(index - this.currentIndex) < maxVideosThreshold}
                                        userId={this.userId} videoId={videoId}  /> ;
    };

    onMomentumScrollEndCallback = () => {
        console.log("activeIndex onMomentumScrollEndCallback===");
        this.setActiveIndex();
    };
    
    onScrollToIndexFailed =( info) => {
        console.log("onScrollToIndexFailed info" , info );  
    }

    render(){
        return(
            <FlatList  
                extraData={this.state.activeIndex}
                snapToAlignment={"top"}
                viewabilityConfig={{itemVisiblePercentThreshold: 90}}
                pagingEnabled={this.state.pagingEnabled}
                decelerationRate={"fast"}
                data={this.state.list}
                onEndReached={this.getNext}
                onRefresh={this.refresh}
                keyExtractor={this._keyExtractor}
                refreshing={this.state.refreshing}
                initialScrollIndex={this.state.activeIndex}
                initialNumToRender={maxVideosThreshold}
                onEndReachedThreshold={7}
                style={inlineStyles.fullScreen}
                onScrollToIndexFailed={this.onScrollToIndexFailed}
                onViewableItemsChanged={ this.onViewableItemsChanged}
                onMomentumScrollEnd={this.onMomentumScrollEndCallback}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
            />
        );
    }



}

export default UserVideoHistoryScreen ; 