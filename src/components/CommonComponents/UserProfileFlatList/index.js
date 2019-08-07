import React, { PureComponent } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Text,
  Dimensions, Image
} from "react-native";
import {SafeAreaView, withNavigation} from "react-navigation";
import FastImage from 'react-native-fast-image';
import reduxGetters from "../../../services/ReduxGetters"; 

import AppConfig from "../../../constants/AppConfig"; 
import Pricer from '../../../services/Pricer';
import Pagination from "../../../services/Pagination";
import PepoApi from "../../../services/PepoApi";

import inlineStyles from './style';

import { Toast } from 'native-base';

import pepoWhiteIcon from '../../../assets/pepo-white-icon.png'


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
      return Pricer.getToBT( Pricer.getFromDecimal( reduxGetters.getVideoBt(videoId) ) ) ;
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
      const videoId = reduxGetters.getUserVideoId(item),
            imageUrl = reduxGetters.getVideoImgUrl( videoId,  null , AppConfig.userVideos.userScreenCoverImageWidth ) ;     
      return imageUrl ? (
        <TouchableWithoutFeedback onPress={() => { this.onVideoClick( item, index ) }}>
          <View>
            <FastImage style={{width: Dimensions.get('window').width / 3, aspectRatio:9/16, margin: 1}}
                       source={{
                        uri: imageUrl,
                        priority: FastImage.priority.high
                       }}/>
            <View style={inlineStyles.videoStatsContainer}>
              <Image style={{height: 16, width: 16}} source={pepoWhiteIcon} />
              <Text style={inlineStyles.videoStatsTxt}>{this.getVideoBtAmount(videoId)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : <View/>;
    };

    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
     };

    onVideoClick = ( item, index  ) => {
        console.log("onVideoClick===" , index);
        this.props.navigation.push("UserVideoHistory", {
          videoHistoryPagination : this.videoHistoryPagination,
          currentIndex: index,
          userId: this.props.userId
        });
    }

    listHeaderComponent = () => {
      return (
        <React.Fragment>
          {this.props.listHeaderComponent}
          {this.state.list.length > 0 && this.props.listHeaderSubComponent }
        </React.Fragment>
      )
    }

    render(){
        return(
            <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
                <FlatList
                    ListHeaderComponent={this.listHeaderComponent()}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    onRefresh={this.refresh}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={9}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderFooter}
                    numColumns={3}
                />
            </SafeAreaView>    
        );
    }
    
}


export default withNavigation( UserProfileFlatList );