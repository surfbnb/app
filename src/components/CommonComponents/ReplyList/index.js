import React , {PureComponent} from "react";
import {FlatList ,View, Platform } from "react-native";
import FloatingBackArrow from "../FlotingBackArrow";
import deepGet from "lodash/get";

import Pagination from "../../../services/Pagination";
import entityHelper from "../../../helpers/EntityHelper";
import DataContract from "../../../constants/DataContract";
import CommonStyle from "../../../theme/styles/Common";
import SafeAreaView from 'react-native-safe-area-view';
import { withNavigation } from "react-navigation";
import TopStatus from "../../Home/TopStatus";
import InvertedReplyList from "../InvertedReplyThumbnailList";
import Utilities from "../../../services/Utilities";
import NoPendantsVideoReplyRow from "../VideoReplyRowComponent/NoPendantsVideoReplyRow";
import Colors from "../../../theme/styles/Colors";
import inlineStyles from "../../FullScreenReplyCollection/styles";

const maxVideosThreshold = 3;
const rowHeight = CommonStyle.fullScreen.height;

class ReplyList extends PureComponent{

    constructor(props){
        super(props);
        this.setVideoPagination();
        this.currentIndex = this.props.currentIndex ;
        /***
         * Note initialScrollIndex should be set only once if it changes flatlist will honor the new initialScrollIndex
         * Which will render extra components and as we keep on changing it will stack instead of clearing
         **/
        this.initialScrollIndex = this.currentIndex;
        this.parentClickHandler = this.props.parentClickHandler;
        this.willFocusSubscription =  null ;
        this.flatlistRef = null;
        this.pendantListRef = null;
        this.state = {
            list : this.getVideoPagination().getResults(),
            activeIndex: this.getCurrentIndex(),
            refreshing : false,
            loadingNext: false
        };
        this.isActiveScreen = true;
        this.pendantClickIndex = -1;
    }

    getBaseUrl(){
        return this.props.baseUrl;
    }

    getPassedFetchServices(){
        return  this.props.fetchServices
    }

    setVideoPagination(){
        let fetchService = this.getPassedFetchServices();
        fetchService = fetchService.cloneWithData();
        this.fullPagePagination = new Pagination( this.getBaseUrl(), null , fetchService);
        this.paginationEvent = this.fullPagePagination.event;
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
            const offset =  this.getCurrentIndex() > 0 ? rowHeight * this.getCurrentIndex() :  0 ;
            this.flatlistRef && this.flatlistRef.scrollToOffset({offset: offset , animated: false});
        });

        this.didFocusSubscription = this.props.navigation.addListener('didFocus', (payload) => {
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
        this.didFocusSubscription &&  this.didFocusSubscription.remove();
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
        }else{
            console.log("_renderItem I shouldnt be here====="  ,index , item);
            return null;
        }
    };

    getPixelDropData = (  ) => {
        return {
            e_entity: DataContract.knownEntityTypes.reply,
            p_type: 'video_reply'
        };
    }

    _renderVideoReplyRow(item, index){
        let userId = deepGet(item,'payload.user_id'),
            replyDetailId = deepGet(item,`payload.${DataContract.replies.replyDetailIdKey}`),
            isActive = index == this.getCurrentIndex()
            doRender = Math.abs(index - this.getCurrentIndex()) < maxVideosThreshold
            ;
        return  <NoPendantsVideoReplyRow
                                shouldPlay={this.shouldPlay}
                                isActive={isActive}
                                getPixelDropData={this.getPixelDropData}
                                doRender={doRender}
                                userId={userId}
                                index={index}
                                replyDetailId={replyDetailId}
                                paginationService ={this.getVideoPagination()}
                                onChildClickDelegate={this.childClickHandler}
                                parentClickHandler={this.parentClickHandler}
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

    getCurrentIndex = () => {
        return this.currentIndex;
    }

    setActiveIndex( index, callback  ) {
        this.setCurrentIndex( index ); //sync click index and currentIndex
        this.setState({ activeIndex:  this.getCurrentIndex()}, callback);
    }

    onViewableItemsChanged = (data) => {
        let currentIndex = deepGet(data, 'viewableItems[0].index');
        if(this.pendantClickIndex == -1 ){
            // If not clicked on pendant (means manual scroll),
            // Trust the onViewableItemsChanged data index
            this.updateIndex( currentIndex );
        }else if(this.pendantClickIndex == currentIndex){
            // if clicked on pendant, 
            // Sometimes onViewableItemsChanged gives wrong index.
            // So trust this.pendantClickIndex and reset this.pendantClickIndex
            // when view scroll to the required index
            this.pendantClickIndex = -1;
        } else {
            // do nothing, as right now there are no more scenarios for scroll
        }
    }

    childClickHandler = ( index, item )=> {
        this.setPendantIndex(index) ;
        this.scrollToIndex( index );
    }

    scrollToIndex = ( index )=>{
        this.setActiveIndex( index, () => {
            if(index==0){
                this.flatlistRef && this.flatlistRef.scrollToOffset({offset: 1});
            }else{
                this.flatlistRef && this.flatlistRef.scrollToIndex({index: index});
            }    
        });
    }
    
    updateIndex = ( index ) =>{
        this.setActiveIndex(index ,() => {this.pendantListRef && this.pendantListRef.setActiveIndex(index)} ) ;
    }

    onMomentumScrollEndCallback = () => {};

    onMomentumScrollBeginCallback = () => {
        this.isScrolled = true;
    }

    onScrollToIndexFailed =( info) => {
        console.log("======onScrollToIndexFailed=====" , info );
    }

    getItemLayout= (data, index) => {
        return {length: rowHeight, offset: rowHeight * index, index} ;
    }

    onScrollToTop = () => {
        this.setActiveIndex();
    }

    setRef = (ref) => {
        this.flatlistRef =  ref;
    }

    setPendantListRef = (ref) => {
        this.pendantListRef = ref;
    }

    render() {
        return (
            <SafeAreaView forceInset={{ top: 'never' }}  style={[{position: "relative", flex: 1, backgroundColor: Colors.darkShadeOfGray}]}>
                <TopStatus />
                
                <View style={[inlineStyles.invertedList , {top: Utilities.getPendantTop() , zIndex:9 , height: Utilities.getPendantAvailableHeight()}]}>
                    <InvertedReplyList  paginationService={this.getVideoPagination()}
                                        onChildClickDelegate={this.childClickHandler}
                                        bottomRounding={50}
                                        getCurrentIndex={this.getCurrentIndex}
                                        onRef={this.setPendantListRef}
                                  />
                </View>    

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
                    ref={this.setRef}
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
                <FloatingBackArrow/>
            </SafeAreaView>
        );
    }

}

ReplyList.defaultProps ={
    currentIndex : 0,
    fetchServices: null,
    baseUrl: null
}

export default withNavigation(  ReplyList );
