import React , {PureComponent} from "react";
import {FlatList} from "react-native";
import deepGet from "lodash/get";
import assignIn from 'lodash/assignIn';

import reduxGetters from "../../services/ReduxGetters";
import Pagination from "../../services/Pagination";
import FullScreenVideoRow from "./FullScreenVideoRow";
import FloatingBackArrow from "../CommonComponents/FlotingBackArrow";
import TopStatus from "../Home/TopStatus";
import CommonStyle from "../../theme/styles/Common";
import entityHelper from '../../helpers/EntityHelper';
import DataContract from "../../constants/DataContract";
import SafeAreaView from 'react-native-safe-area-view';
import VideoReplyRow from "../CommonComponents/VideoReplyRowComponent/VideoReplyRow";

const maxVideosThreshold = 3;
const rowHeight = CommonStyle.fullScreen.height;

class FullScreenVideoCollection extends PureComponent{

    static navigationOptions = (options) => {
        return {
            headerBackTitle: null,
            header: null
        };
    };

    constructor(props){
        super(props);
        this.setVideoPagination();
        this.paginationEvent = this.getVideoPagination().event;
        this.currentIndex = this.props.navigation.getParam("currentIndex");
         /***
         * Note initialScrollIndex should be set only once if it changes flatlist will honor the new initialScrollIndex
         * Which will render extra components and as we keep on changing it will stack instead of clearing
         **/
        this.initialScrollIndex = this.currentIndex;
        this.getPixelDropData = this.props.navigation.getParam("getPixelDropData");
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
        this.fullPagePagination = new Pagination( this.getBaseUrl(), null , this.getPassedFetchServices());
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
            const offset =  this.state.activeIndex > 0 ? rowHeight * this.state.activeIndex :  0 ;
            this.flatlistRef && this.flatlistRef.scrollToOffset({offset: offset , animated: false});
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
        this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    shouldPlay = () => {
        return this.isActiveScreen;
    };

    beforeRefresh = ( ) => {
        this.setState({ refreshing : true });
    }

    onRefresh = ( res ) => {
        this.setState({ refreshing : false ,  list : this.getVideoPagination().getResults() });
    }

    onRefreshError = ( error ) => {
        this.setState({ refreshing : false });
    }

    beforeNext =() => {
        this.isScrolled = false;
        this.setState({ loadingNext : true });
    }

    onNext = ( res  ) => {
        this.setState({ loadingNext : false ,  list : this.getVideoPagination().getResults() });
    }

    onNextError = ( error ) => {
        this.setState({ loadingNext : false });
    }

    getNext = () => {
        console.log('getNextgetNext',this.isScrolled);
        // if(!this.isScrolled) return;
        this.getVideoPagination().getNext();
    }

    refresh = () => {
        this.getVideoPagination().refresh();
    }

    _keyExtractor = (item, index) => {
        let keyStr = `id_${item.id}`;
        return keyStr;
    };

    _renderItem = ({ item, index }) => {
        const payload = reduxGetters.getTagsVideoPayload(item);
        console.log("payload", payload);
        if(entityHelper.isVideoReplyEntity( item )){
            if(entityHelper.isReplyVideoTypeEntity(item)){
             return this._renderVideoReplyRow( item, index );
            }
        } else if( entityHelper.isVideoEntity( item )) {
           return this._renderVideoRow( item, index);
        }

    };

    getPixelDropData = () => {
        const parentData = {} ;
        if(typeof this.props.getPixelDropData == "function"){
          parentData =  this.props.getPixelDropData()
        } 
        return parentData;
    }

    parentClickHandler =(replyDetailId)=>{
        const parentVideoId =  reduxGetters.getReplyParentVideoId(replyDetailId),
                parentUserId = reduxGetters.getReplyParentUserId(replyDetailId );
        this.props.navigation.push('VideoPlayer', {
          userId: parentUserId,
          videoId: parentVideoId
        });
    }

    isActiveEntity = (fullVideoReplyId , item , index)=> {
    let replyId = deepGet(item, `payload.${DataContract.replies.replyDetailIdKey}`)
        return fullVideoReplyId == replyId;
    }

    _renderVideoReplyRow(item, index){
        let userId = deepGet(item,'payload.user_id'),
            replyDetailId = deepGet(item,`payload.${DataContract.replies.replyDetailIdKey}`),
            rowKey = this._keyExtractor(item, index)
        ;
        return  <VideoReplyRow  shouldPlay={this.shouldPlay}
                                listKey={`${rowKey}-video-row`}
                                isActive={index == this.state.activeIndex}
                                getPixelDropData={this.getPixelDropData}
                                doRender={Math.abs(index - this.state.activeIndex) < maxVideosThreshold}
                                userId={userId}
                                index={index}
                                replyDetailId={replyDetailId}
                                parentClickHandler={()=>{this.parentClickHandler(replyDetailId)}}
                                isActiveEntity={this.isActiveEntity}
         /> ;
    }

    _renderVideoRow( item, index ){
        let rowKey = this._keyExtractor(item, index);
        return  <FullScreenVideoRow shouldPlay={this.shouldPlay}
                    listKey={`${rowKey}-full-screen-video-row`}
                    index={index}
                    isActive={index == this.state.activeIndex}
                    getPixelDropData={this.getPixelDropData}
                    doRender={Math.abs(index - this.state.activeIndex) < maxVideosThreshold}
                    payload={item.payload}
         /> ;
    }

    onViewableItemsChanged = (data) => {
        const currentIndex = deepGet(data, 'viewableItems[0].index'); 
        if("number" === typeof currentIndex ){
            this.currentIndex = currentIndex;
        }
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
            <SafeAreaView forceInset={{ top: 'never' }}  style={CommonStyle.fullScreenVideoSafeAreaContainer}>
                {this.props.navigation.getParam("showBalanceFlyer")  && <TopStatus />}
                <FlatList
                    listKey={"some-key-to-be-changed-passed-as-props"}
                    snapToAlignment={"top"}
                    viewabilityConfig={{itemVisiblePercentThreshold: 90}}
                    extraData={this.state.activeIndex}
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
                    nestedScrollEnabled={true}
                    getItemLayout={this.getItemLayout}
                    onScrollToIndexFailed={this.onScrollToIndexFailed}
                />
                <FloatingBackArrow/>
            </SafeAreaView>
        );
    }

}

export default FullScreenVideoCollection ;
