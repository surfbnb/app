import React , {PureComponent} from "react";
import {FlatList , View , TouchableOpacity, Image, Easing, Animated} from "react-native";
import deepGet from "lodash/get";
import reduxGetters from "../../services/ReduxGetters";
import Pagination from "../../services/Pagination";
import FullScreeVideoRow from "./FullScreeVideoRow";
import inlineStyles from "./newStyles";
import historyBack from '../../assets/user-video-history-back-icon.png';
import TopStatus from "../Home/TopStatus";
import { CUSTOM_TAB_Height } from '../../theme/constants';
import { StackViewTransitionConfigs } from 'react-navigation-stack';

const maxVideosThreshold = 3;
const windowHeight = inlineStyles.fullScreen.height;

class FullScreenVideoCollection extends PureComponent{

    static navigationOptions = (options) => {
        console.log("FullScreenVideoCollection.navigationOptions called!");
        return {
            headerBackTitle: null,
            header: null,
            headerShown: false
        };
    };


    /* Begin: - My transition code. */
    static transitionConfig = (transitionProps, prevTransitionProps, isModal, isCurrent) => { 

        const defaultTransitionConfig = StackViewTransitionConfigs.defaultTransitionConfig(
            transitionProps,
            prevTransitionProps,
            true
        );

        
        let sceneRoute;   
        console.log("isCurrent", isCurrent);
        if ( isCurrent ) {
          sceneRoute = transitionProps.scene.route;      
        } else if (prevTransitionProps) {
          sceneRoute = prevTransitionProps.scene.route;   
        }
        const params = sceneRoute.params;

        if ( !params.videoThumbnailMesurements ) {
            console.log("videoThumbnailMesurements not found. params", params);
            // Show default animation.
            return null;
        }
        console.log("videoThumbnailMesurements", params.videoThumbnailMesurements);

        let thumbnailY = params.videoThumbnailMesurements.pageY;
        let thumbnailX = params.videoThumbnailMesurements.pageX;
        let thumbnailWidth = params.videoThumbnailMesurements.width;
        let thumbnailHeight = params.videoThumbnailMesurements.height;

        return {
            transitionSpec: {
              duration: 400,
              easing: Easing.out(Easing.poly(4)),
              timing: Animated.timing
            },
            screenInterpolator: (sceneProps) => {              
              if ( "FullScreenVideoCollection" !== sceneProps.scene.route.routeName ) {
                // Do nothing.
                return {};
              }

              const { layout, position, scene } = sceneProps;
              const { index } = scene;
              const transforms = {};

              // Calculate scale Y
              const scaleYFactor = thumbnailHeight/windowHeight;
              // Scale Y transform 
              transforms.scaleY  = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [scaleYFactor, 1, 1]
              });


              // Calculate scale X
              const layoutWidth = layout.initWidth;
              const scaleXFactor = thumbnailWidth/layoutWidth;
              // Scale X transform 
              transforms.scaleX  = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [scaleXFactor, 1, 1]
              });              
              
              // Translate X 
              if ( thumbnailX > 0 ) {
                  transforms.translateX = position.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [thumbnailX, 0, 0]
                  });
              } else {
                  // Move the thumbnail to left.
                  transforms.translateX = position.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [-thumbnailWidth, 0, 0]
                  });
              }

              // Translate Y
              // -- compute vertical padding.
              let verticalPadding = (windowHeight - thumbnailHeight) / 2;
              // -- apply magical formulla.
              let translateYVal =  (thumbnailY - verticalPadding) / scaleYFactor;

              // -- as bottom tab bar is a pain, manuplate it.
              if ( !isCurrent ) {
                translateYVal = translateYVal + (CUSTOM_TAB_Height * scaleYFactor);
              }

              transforms.translateY = position.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [translateYVal, 0, 0]
              });

              console.log("transform",
                "\n ---translateYVal", translateYVal, 
                "\n ---thumbnailWidth", thumbnailWidth, 
                "\n ---thumbnailX", thumbnailX,
                "\n ---scaleXFactor", scaleXFactor,
                "\n ---scaleYFactor", scaleYFactor,
                "\n ---layoutWidth", layoutWidth,
                "\n ---windowHeight", windowHeight);

              return { transform: [transforms] };
            }
        };
    };
    /* End: - My transition code */

    constructor(props){
        super(props);
        this.setVideoPagination();
        this.paginationEvent = this.getVideoPagination().event;
        this.currentIndex = this.props.navigation.getParam("currentIndex");
        this.isScrolled = false ;
        this.willFocusSubscription =  null ;
        this.flatlistRef = null;

        this.state = {
            list : this.getVideoPagination().getList(),
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
        this.setState({ refreshing : false ,  list : this.getVideoPagination().getList() });
    }

    onRefreshError = ( error ) => {
        this.setState({ refreshing : false });
    }

    beforeNext =() => {
        this.isScrolled = false;
        this.setState({ loadingNext : true });
    }

    onNext = ( res  ) => {
        this.setState({ loadingNext : false ,  list : this.getVideoPagination().getList() });
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
        return  <FullScreeVideoRow shouldPlay={this.shouldPlay}
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
                {this.props.navigation.getParam("showBalanceFlier")  && <TopStatus />}
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
