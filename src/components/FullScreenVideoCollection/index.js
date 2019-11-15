import React , {PureComponent} from "react";
import {FlatList , View , TouchableOpacity, Image} from "react-native";
import deepGet from "lodash/get";
import reduxGetters from "../../services/ReduxGetters";
import Pagination from "../../services/Pagination";
import FullScreenVideoRow from "./FullScreenVideoRow";
import inlineStyles from "./styles";
import historyBack from '../../assets/user-video-history-back-icon.png';
import TopStatus from "../Home/TopStatus";
import CommonStyle from "../../theme/styles/Common";
import entityHelper from '../../helpers/EntityHelper';

const maxVideosThreshold = 3;

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
            const offset =  this.state.activeIndex > 0 ? inlineStyles.fullScreen.height * this.state.activeIndex :  0 ;
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
        return `id_${item}`;
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

    _renderVideoReplyRow(item, index){
        return  <VideoReplyRow  shouldPlay={this.shouldPlay}
                                isActive={index == this.state.activeIndex}
                                doRender={Math.abs(index - this.state.activeIndex) < maxVideosThreshold}
                                item={item.payload}
         /> ;
    }

    _renderVideoRow( item, index ){
        return  <FullScreenVideoRow shouldPlay={this.shouldPlay}
                    isActive={index == this.state.activeIndex}
                    doRender={Math.abs(index - this.state.activeIndex) < maxVideosThreshold}
                    payload={item.payload}
         /> ;
    }

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
        return {length: inlineStyles.fullScreen.height, offset: inlineStyles.fullScreen.height * index, index} ;
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
            <View style={CommonStyle.viewContainer}>
                {this.props.navigation.getParam("showBalanceFlyer")  && <TopStatus />}
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
                    style={[inlineStyles.fullScreen , {backgroundColor: "#000"}]}
                    showsVerticalScrollIndicator={false}
                    onScrollToTop={this.onScrollToTop}
                    initialScrollIndex={this.state.activeIndex}
                    getItemLayout={this.getItemLayout}
                    onScrollToIndexFailed={this.onScrollToIndexFailed}
                />
                <TouchableOpacity onPress={this.closeVideo} style={inlineStyles.historyBackSkipFont}>
                    <Image style={{ width: 14.5, height: 22 }} source={historyBack} />
                </TouchableOpacity>
            </View>
        );
    }

}

export default FullScreenVideoCollection ;
