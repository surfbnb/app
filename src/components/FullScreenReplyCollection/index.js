import React , {PureComponent} from "react";
import {FlatList ,View, Platform } from "react-native";
import FloatingBackArrow from "../CommonComponents/FlotingBackArrow";
import deepGet from "lodash/get";

import Pagination from "../../services/Pagination";
import entityHelper from "../../helpers/EntityHelper";
import DataContract from "../../constants/DataContract";
import CommonStyle from "../../theme/styles/Common";
import { SafeAreaView } from "react-navigation";
import ReplyHelper from "../../helpers/ReplyHelper";
import TopStatus from "../Home/TopStatus";
import InvertedReplyList from "../CommonComponents/InvertedReplyThumbnailList";
import NoPendantsVideoReplyRow from "./NoPendantsVideoReplyRow";
import Utilities from "../../services/Utilities";

const maxVideosThreshold = 3;

class FullScreenReplyCollection extends PureComponent{

    static navigationOptions = (props) => {
        return {
            headerBackTitle: null,
            header: null
        };
    };

    constructor(props){
        super(props);
        this.setVideoPagination();
        this.paginationEvent = this.getVideoPagination().event;
        this.currentIndex = this.props.navigation.getParam("currentIndex") || 0;
        this.parentClickHandler = this.props.navigation.getParam("parentClickHandler");
        this.pendantClickIndex = -1;
        this.isScrolled = false ;
        this.willFocusSubscription =  null ;
        this.flatlistRef = null;

        this.state = {
            list : this.getVideoPagination().getResults(),
            activeIndex: this.currentIndex,
            refreshing : false,
            loadingNext: false
        };
        this.isActiveScreen = true;
    }

    getBaseUrl(){
        return this.props.navigation.getParam("baseUrl");
    }

    getPassedFetchServices(){
        return  this.props.navigation.getParam("fetchServices")
    }

    setVideoPagination(){
        let fetchService = this.getPassedFetchServices();
        fetchService = fetchService.cloneWithData();
        this.fullPagePagination = new Pagination( this.getBaseUrl(), null , fetchService);
    }

    getVideoPagination(){
        return this.fullPagePagination;
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
            const offset =  this.state.activeIndex > 0 ? CommonStyle.fullScreen.height * this.state.activeIndex :  0 ;
            this.flatlistRef && this.flatlistRef.scrollToOffset({offset: offset , animated: false});
            this.isActiveScreen = true ;
        });

        this.willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) => {
            this.isActiveScreen =  false ;
        });

        //If there is no getPassedFetchServices passed that means its a fresh view.
        //So load data
        if(!this.getPassedFetchServices()){
            this.refresh();
        }
    }

    componentWillUnmount(){
        this.paginationEvent.removeListener('onBeforeRefresh');
        this.paginationEvent.removeListener('onRefresh');
        this.paginationEvent.removeListener('onRefreshError');
        this.paginationEvent.removeListener('onBeforeNext');
        this.paginationEvent.removeListener('onNext');
        this.paginationEvent.removeListener('onNextError');
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    shouldPlay = () => {
        return this.isActiveScreen;
    };

    beforeRefresh = ( ) => {
        this.setState({ refreshing : true });
    }

    onRefresh = ( res ) => {
      let paginationService = this.getVideoPagination();
      let resultList = paginationService.getResults();
      this.setState({ refreshing : false ,  list : resultList });
    }

    onRefreshError = ( error ) => {
        this.setState({ refreshing : false });
    }

    beforeNext =() => {
        this.isScrolled = false;
        this.setState({ loadingNext : true });
    }

    onNext = ( res  ) => {
        let paginationService = this.getVideoPagination();
        let resultList = paginationService.getResults();
        this.setState({ loadingNext : false ,  list : resultList });
    }

    onNextError = ( error ) => {
        this.setState({ loadingNext : false });
    }

    getNext = () => {
        // if(!this.isScrolled) return;
        this.getVideoPagination().getNext();
    }

    refresh = () => {
        this.getVideoPagination().refresh();
    }

    _keyExtractor = (item, index) => {
        return `id_${item.id}`;
    }

    _renderItem = ({ item, index }) => {
        if(entityHelper.isVideoReplyEntity( item )){
            if(entityHelper.isReplyVideoTypeEntity(item)){
                return this._renderVideoReplyRow( item, index );
            }
        }
    };

    getPixelDropData = ( replyDetailId ) => {
        return () => {
            return {
                e_entity: 'reply',
                p_type: 'video_reply'
              };
        }
    }

    _renderVideoReplyRow(item, index){
        let userId = deepGet(item,'payload.user_id'),
            replyDetailId = deepGet(item,`payload.${DataContract.replies.replyDetailIdKey}`);
        return  <NoPendantsVideoReplyRow
                                shouldPlay={this.shouldPlay}
                                isActive={index == this.state.activeIndex}
                                getPixelDropData={this.getPixelDropData(replyDetailId)}
                                doRender={Math.abs(index - this.state.activeIndex) < maxVideosThreshold}
                                userId={userId}
                                replyDetailId={replyDetailId}
                                paginationService ={this.getVideoPagination()}
                                onChildClickDelegate={this.childClickHandler}
                                parentClickHandler={this.parentClickHandler}
                                currentIndex={this.state.activeIndex}
         /> ;
    }

    setPendantIndex = (index) => { 
        if ( "number" === typeof index ) {
            this.pendantClickIndex = index;
        }
    }

    setCurrentIndex = (index) => {
        if ( "number" === typeof index ) {
            this.currentIndex = index;
        }
    }

    setActiveIndex( index, callback  ) {
        this.setCurrentIndex( index ); //sync click index and currentIndex
        this.setState({ activeIndex:  this.currentIndex }, callback);
    }

    childClickHandler = ( index, item )=> {
        this.setPendantIndex(index) ;
        this.scrollToIndex( index );
        ReplyHelper.updateEntitySeen( item );
    }

    scrollToIndex = ( index )=>{
        this.setActiveIndex( index, () => {
            this.flatlistRef.scrollToIndex({index: index});
        });
    }

    onViewableItemsChanged = (data) => {
        let item = deepGet(data, 'viewableItems[0].item');
        item && ReplyHelper.updateEntitySeen( item );
        let currentIndex = deepGet(data, 'viewableItems[0].index');
        this.setCurrentIndex( currentIndex );
        this.forceSetIndexAndroid();
    }

    forceSetIndexAndroid(){
        if(Platform.OS != "android") return;
        if(this.currentIndex == this.pendantClickIndex){
            this.setState({activeIndex: this.currentIndex},  ()=> {this.pendantClickIndex =  -1});
        }
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
        return {length: CommonStyle.fullScreen.height, offset: CommonStyle.fullScreen.height * index, index} ;
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
        return (
            <SafeAreaView forceInset={{ top: 'never' }}  style={[CommonStyle.fullScreenVideoSafeAreaContainer, {position: "relative"}]}>
                <TopStatus />
                
                <View style={{position: "absolute" , top: Utilities.getPendantTop() , zIndex:9 , height: Utilities.getPendantAvailableHeight(), marginRight: 'auto', minWidth: '20%'}}>
                    <InvertedReplyList  paginationService={this.getVideoPagination()}
                                        onChildClickDelegate={this.childClickHandler}
                                        bottomRounding={50}
                                        currentIndex={this.state.activeIndex}
                                  />
                </View>    

                <FlatList
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
                    initialScrollIndex={this.state.activeIndex}
                    getItemLayout={this.getItemLayout}
                    onScrollToIndexFailed={this.onScrollToIndexFailed}
                />
                <FloatingBackArrow/>
            </SafeAreaView>
        );
    }

}

export default FullScreenReplyCollection ;
