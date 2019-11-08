import React , {PureComponent} from "react";
import {FlatList , View , TouchableOpacity, Image, Text, StatusBar} from "react-native";
import deepGet from "lodash/get";

import Pagination from "../../services/Pagination";
import inlineStyles from "./styles";
import backIcon from '../../assets/back-arrow.png';
import plusIcon from '../../assets/user-video-capture-icon-selected.png';
import VideoReply from "./VideoReply";

const maxVideosThreshold = 3;
const HeaderLeft = (props) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}
        style={inlineStyles.iconWrapper}
      >
        <Image style={inlineStyles.iconSkipFont} source={backIcon}></Image>
      </TouchableOpacity>
    );
  };
  
  const HeaderRight = (props) => {
    return (<TouchableOpacity onPress={()=>{
        props.navigation.push('CaptureVideo')
    }} style={inlineStyles.iconWrapper} >
        <Image style={[inlineStyles.iconSkipFont]} source={plusIcon} />
    </TouchableOpacity>)
  };
  
  const HeaderTitle = (props) => {
    return (
      <View>
        <Text numberOfLines={1} style={inlineStyles.headerText}>
        Replies to Frankie
        </Text>
        <Text style={inlineStyles.headerSubText}>Send a reply with Pepo5</Text>
      </View>
    );
  };

class VideoRepliesFullScreen extends PureComponent{

    static navigationOptions = (props) => {
        return {
            headerBackTitle: null,
            headerStyle: inlineStyles.headerStyles,
            headerLeft: <HeaderLeft {...props} />,
            headerRight: <HeaderRight {...props} />,
            headerTitle: <HeaderTitle {...props} />
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
        const payload = item.payload;
        return  <VideoReply shouldPlay={this.shouldPlay}
                                   isActive={index == this.state.activeIndex}
                                   doRender={Math.abs(index - this.state.activeIndex) < maxVideosThreshold}
                                   payload={payload}
                                    /> ;
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
            <View style={{flex: 1}}>
                <StatusBar translucent={true} backgroundColor={'transparent'} />
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
            </View>
        );
    }

}

export default VideoRepliesFullScreen ;
