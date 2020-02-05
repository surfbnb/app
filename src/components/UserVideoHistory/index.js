import React , {PureComponent} from "react";
import {FlatList} from "react-native";
import deepGet from "lodash/get";
import reduxGetters from "../../services/ReduxGetters";
import Pagination from "../../services/Pagination";

import UserVideoHistoryRow from "./UserVideoHistoryRow";
import TopStatus from "../../components/Home/TopStatus";
import CurrentUser from "../../models/CurrentUser";
import CommonStyle from "../../theme/styles/Common";

import FlotingBackArrow from "../CommonComponents/FlotingBackArrow";
import SafeAreaView from 'react-native-safe-area-view';

const maxVideosThreshold = 3;
const rowHeight = CommonStyle.fullScreen.height;

class UserVideoHistoryScreen extends PureComponent{

  static navigationOptions = (options) => {
    return {
      headerBackTitle: null,
      header: null
    };
  };

    constructor(props){
        super(props);
        this.userId =  this.props.navigation.getParam("userId");
        this.videoHistoryPagination = new Pagination( this._fetchUrlVideoHistory(), {} , this.props.navigation.getParam("fetchServices"));
        this.paginationEvent = this.videoHistoryPagination.event;
        this.currentIndex = this.props.navigation.getParam("currentIndex");
        /***
         * Note initialScrollIndex should be set only once if it changes flatlist will honor the new initialScrollIndex
         * Which will render extra components and as we keep on changing it will stack instead of clearing
         **/
        this.initialScrollIndex =  this.currentIndex;
        this.isScrolled = false ;
        this.willFocusSubscription =  null ;
        this.flatlistRef = null;

        this.state = {
            list : this.videoHistoryPagination.getList(),
            activeIndex: this.currentIndex,
            refreshing : false,
            loadingNext: false
        };
       this.isActiveScreen = true;
    }

    _fetchUrlVideoHistory(){
        return `/users/${this.userId}/video-history` ;
    }

    componentDidMount(){
        this.paginationEvent.on("onBeforeRefresh" ,  this.beforeRefresh.bind(this) );
        this.paginationEvent.on("onRefresh" , this.onRefresh.bind(this) );
        this.paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this)  );
        this.paginationEvent.on("onBeforeNext" ,  this.beforeNext.bind(this) );
        this.paginationEvent.on("onNext" , this.onNext.bind(this) );
        this.paginationEvent.on("onNextError" , this.onNextError.bind(this) );

        //This is an hack for reset scroll for flatlist. Need to debug a bit more.
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', (payload) => {
            const offset =  this.state.activeIndex > 0 ? rowHeight * this.state.activeIndex :  0 ;
            this.flatlistRef && this.flatlistRef.scrollToOffset({offset: offset , animated: false});
        });

        this.didFocusSubscription = this.props.navigation.addListener('didFocus', (payload) => {
            this.isActiveScreen = true ;
        });

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) => {
            this.isActiveScreen =  false ;
        });
    }

    componentWillUnmount(){
        this.paginationEvent.removeListener('onBeforeRefresh');
        this.paginationEvent.removeListener('onRefresh');
        this.paginationEvent.removeListener('onRefreshError');
        this.paginationEvent.removeListener('onBeforeNext');
        this.paginationEvent.removeListener('onNext');
        this.paginationEvent.removeListener('onNextError');
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    shouldPlay = () => {
        return this.isActiveScreen;
    };

    beforeRefresh = ( ) => {
        this.setState({ refreshing : true });
    }

    onRefresh = ( res ) => {
        this.setState({ refreshing : false ,  list : this.videoHistoryPagination.getList() });
    }

    onRefreshError = ( error ) => {
        this.setState({ refreshing : false });
    }

    beforeNext =() => {
        this.isScrolled = false;
        this.setState({ loadingNext : true });
    }

    onNext = ( res  ) => {
        this.setState({ loadingNext : false ,  list : this.videoHistoryPagination.getList() });
    }

    onNextError = ( error ) => {
        this.setState({ loadingNext : false });
    }

    getNext = () => {
      if(!this.isScrolled) return;
      this.videoHistoryPagination.getNext();
    }

    refresh = () => {
      this.videoHistoryPagination.refresh();
    }

    _keyExtractor = (item, index) => {
        return `id_${item}`;
    };

    getPixelDropData = () => {
        return pixelParams = {
          p_type: 'user_profile',
          p_name: this.userId
        };
    } 

    _renderItem = ({ item, index }) => {
        const videoId = reduxGetters.getUserVideoId(item) ;
        return  <UserVideoHistoryRow    shouldPlay={this.shouldPlay}
                                        index={index}
                                        getPixelDropData={this.getPixelDropData}
                                        isActive={index == this.state.activeIndex}
                                        doRender={Math.abs(index - this.state.activeIndex) < maxVideosThreshold}
                                        userId={this.userId} videoId={videoId}  /> ;
    };

    onViewableItemsChanged = (data) => {
        this.currentIndex = deepGet(data, 'viewableItems[0].index') || 0;
    }

    setActiveIndex() {
        this.setState({ activeIndex: this.currentIndex });
    }

    onMomentumScrollEndCallback = () => {
        this.setActiveIndex();
    };

    onMomentumScrollBeginCallback = () => {
        this.isScrolled = true;
    }

    onScrollToIndexFailed =( info) => {
        console.log("======onScrollToIndexFailed=====" , info );
    }

    getItemLayout= (data, index) => {
       return {length: rowHeight, offset: rowHeight * index, index} ;
    }

    isCurrentUser(){
        return this.userId == CurrentUser.getUserId();
    }

    closeVideo = () => {
        this.navigateBack();
      };

    navigateBack() {
        this.props.navigation.goBack();
    }

    onScrollToTop = () => {
       this.setActiveIndex();
    }

    render() {
        return(
            <SafeAreaView forceInset={{ top: 'never' }}  style={CommonStyle.fullScreenVideoSafeAreaContainer}>
                <TopStatus />
                <FlatList
                    extraData={this.state.activeIndex}
                    snapToAlignment={"top"}
                    viewabilityConfig={{itemVisiblePercentThreshold: 90}}
                    pagingEnabled={true}
                    decelerationRate={"normal"}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    onRefresh={this.refresh}
                    refreshing={this.state.refreshing}
                    keyExtractor={this._keyExtractor}
                    ref={(ref)=> {this.flatlistRef =  ref }}
                    onEndReachedThreshold={7}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    onMomentumScrollEnd={this.onMomentumScrollEndCallback}
                    onMomentumScrollBegin={this.onMomentumScrollBeginCallback}
                    renderItem={this._renderItem}
                    style={[CommonStyle.fullScreen , {backgroundColor: "#000"}]}
                    showsVerticalScrollIndicator={false}
                    onScrollToTop={this.onScrollToTop}
                    initialScrollIndex={this.initialScrollIndex}
                    getItemLayout={this.getItemLayout}
                    onScrollToIndexFailed={this.onScrollToIndexFailed}
                />
                <FlotingBackArrow/>
             </SafeAreaView>
        );
    }

}

export default UserVideoHistoryScreen ;
