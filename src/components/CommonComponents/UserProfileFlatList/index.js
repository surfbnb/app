import React, { PureComponent } from 'react';
import {View , TouchableWithoutFeedback , FlatList , ActivityIndicator , Text} from "react-native";
import {SafeAreaView} from "react-navigation";
import FastImage from 'react-native-fast-image';
import reduxGetters from "../../../services/ReduxGetters"; 

import AppConfig from "../../../constants/AppConfig"; 
import Pricer from '../../../services/Pricer';
import Pagination from "../../../services/Pagination";
import PepoApi from "../../../services/PepoApi";

import { Toast } from 'native-base';

class UserProfileFlatList extends PureComponent {
    constructor(props){
        super(props);

        this.state = {
            list : [] ,
            refreshing : false, 
            loadingNext: false
        }

        this.videoHistoryPagination = new Pagination( this._fetchUrlVideoHistory() , {
            beforeRefresh : this.beforeRefresh, 
            onRefresh : this.onRefresh, 
            onRefreshError: this.onRefreshError , 
            beforeNext: this.beforeNext,
            onNext: this.onNext,
            onNextError: this.onNextError
        } )
    }

    fetchUser = () => {
        return new PepoApi(`/users/${this.props.userId}/profile`)
          .get()
          .then((res) => {
            if (!res || !res.success) {
              Toast.show({
                text: ostErrors.getErrorMessage(res),
                buttonText: 'OK'
              });
            }
          })
          .catch((error) => {
            Toast.show({
              text: ostErrors.getErrorMessage(error),
              buttonText: 'OK'
            });
          })
          .finally(() => {});
      };
      
      onPullToRefresh = () => {
        this.fetchUser(); 
      } 

    componentDidMount(){
        this.fetchUser();
        this.videoHistoryPagination.initPagination();
    }

    _fetchUrlVideoHistory(){
        if(!this.props.userId){  return null }
        return `/users/${this.props.userId}/video-history` ; 
    }

    getVideoBtAmount(videoId){
        Pricer.getToBT( Pricer.getFromDecimal( reduxGetters.getVideoBt(videoId) ) ) ; 
    }

    beforeRefresh = ( ) => {
        this.onPullToRefresh();
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

    _keyExtractor = (item, index) => `id_${item}`;

    _renderItem = ({ item, index }) => {
      const videoId = reduxGetters.getUserVideoId(item) 
            imageUrl = reduxGetters.getVideoImgUrl( videoId,  null , AppConfig.userVideos.userScreenCoverImageWidth ) ;     
      return imageUrl ? (
          <TouchableWithoutFeedback onPress={this.onVideoClick}>
            <View style={{width:"30%" , flex:1 , backgroundColor: "red"}} >  
                <FastImage style={{width:"100%", aspectRatio:9/16}}
                            source={{
                            uri: imageUrl,
                            priority: FastImage.priority.high
                          }}/>
                <Text>{this.getVideoBtAmount(videoId)}</Text>  
             </View>            
          </TouchableWithoutFeedback>
      ) : <View/>;
    };

    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
     };

    onVideoClick = () => {
        
    }

    render(){
        return(
            <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
                <FlatList
                    ListHeaderComponent={this.props.listHeaderComponent}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    onRefresh={this.refresh}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={9}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderFooter}
                />
            </SafeAreaView>    
        );
    }
    
}


export default UserProfileFlatList;