import React , {PureComponent} from "react"; 
import {View, Text , FlatList} from "react-native";
import deepGet from "lodash/get";
import reduxGetters from "../../services/ReduxGetters";

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

        this.state = {
            list : this.videoHistoryPagination.list,
            refreshing : false, 
            loadingNext: false,
            activeIndex: this.currentIndex
        }
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
        this.currentIndex = deepGet(data, 'viewableItems[0].index') || 0;
    }
    
    setActiveIndex() {
        if (this.state.activeIndex == this.currentIndex) return;
        this.setState({ activeIndex: this.currentIndex });
    }

    _keyExtractor = (item, index) => `id_${item}`;

    _renderItem = ({ item, index }) => {
        const videoId = reduxGetters.getUserVideoId(item) ; 
        return (
            <View><Text>{videoId}</Text></View>
        );
    };

    onMomentumScrollEndCallback = () => {
        this.setActiveIndex();
    };
    
    render(){
        return(
            <FlatList
                extraData={this.state.activeIndex}
                snapToAlignment={"top"}
                viewabilityConfig={{itemVisiblePercentThreshold: 90}}
                pagingEnabled={true}
                decelerationRate={"fast"}
                data={this.state.list}
                onEndReached={this.getNext}
                onRefresh={this.refresh}
                keyExtractor={this._keyExtractor}
                refreshing={this.state.refreshing}
                initialNumToRender={maxVideosThreshold}
                onEndReachedThreshold={7}
                //style={inlineStyles.fullScreen}
                onViewableItemsChanged={ this.onViewableItemsChanged}
                onMomentumScrollEnd={this.onMomentumScrollEndCallback}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
            />
        );
    }



}

export default UserVideoHistoryScreen ; 