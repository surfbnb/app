import React , {PureComponent} from "react"; 
import {FlatList , View , TouchableOpacity, Image} from "react-native";
import deepGet from "lodash/get";
import reduxGetters from "../../services/ReduxGetters";
import Pagination from "../../services/Pagination";

import UserVideoHistoryRow from "./UserVideoHistoryRow";
import TopStatus from "../../components/Home/TopStatus";

import inlineStyles from "./styles";
import CurrentUser from "../../models/CurrentUser";

import historyBack from '../../assets/user-video-history-back-icon.png';

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
        this.videoHistoryPagination = new Pagination( this._fetchUrlVideoHistory(), {} , this.props.navigation.getParam("fetchServices"));
        this.paginationEvent = this.videoHistoryPagination.event;
        this.currentIndex = this.props.navigation.getParam("currentIndex");
        this.isScrolled = false ;
       
        this.state = {
            list : this.videoHistoryPagination.getList(),
            activeIndex: this.currentIndex,
            refreshing : false, 
            loadingNext: false
        }
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
    }

    componentWillUnmount(){
        this.paginationEvent.removeListener('onBeforeRefresh');
        this.paginationEvent.removeListener('onRefresh');
        this.paginationEvent.removeListener('onRefreshError');
        this.paginationEvent.removeListener('onBeforeNext');
        this.paginationEvent.removeListener('onNext');
        this.paginationEvent.removeListener('onNextError');
    }
    
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

    _renderItem = ({ item, index }) => {
        console.log("_renderItem = index = activeIndex =" , index  , this.state.activeIndex );
        const videoId = reduxGetters.getUserVideoId(item) ;
        return  <UserVideoHistoryRow    isActive={index == this.state.activeIndex}
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
       return {length: inlineStyles.fullScreen.height, offset: inlineStyles.fullScreen.height * index, index} ; 
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
            <View style={{flex: 1}}>
                {!this.isCurrentUser() &&  <TopStatus />} 
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

export default UserVideoHistoryScreen ; 