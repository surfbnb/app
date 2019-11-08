import React, { PureComponent } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Text,
  Dimensions,
  Image,
  TouchableOpacity
} from "react-native";
import {SafeAreaView} from "react-navigation";
import FastImage from 'react-native-fast-image';
import LinearGradient from "react-native-linear-gradient";

import reduxGetters from "../../services/ReduxGetters";
import AppConfig from "../../constants/AppConfig";
import Pricer from '../../services/Pricer';
import Pagination from "../../services/Pagination";
import {fetchUser} from "../../helpers/helpers";
import multipleClickHandler from '../../services/MultipleClickHandler';
import plusIcon from '../../assets/user-video-capture-icon-selected.png';
import inlineStyles from './styles';
import pepoWhiteIcon from '../../assets/pepo-white-icon.png'
import CurrentUser from "../../models/CurrentUser";
import DeleteVideo from "../../components/CommonComponents/DeleteVideo";
import Colors from '../../theme/styles/Colors';
import crossIcon from '../../assets/cross_icon.png';

const HeaderLeft = (props) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}
        style={inlineStyles.iconWrapper}
      >
        <Image style={inlineStyles.iconSkipFont} source={crossIcon}></Image>
      </TouchableOpacity>
    );
  };
  
  const HeaderRight = (props) => {
    return (<TouchableOpacity onPress={()=>{
        props.navigation.push('CaptureVideo')
    }} style={inlineStyles.iconWrapper} >
        <Image style={[styles.iconSkipFont]} source={plusIcon} />
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

class VideoRepliesScreen extends PureComponent {
    static navigationOptions = (props) => {
        return {
          headerStyle: inlineStyles.headerStyles,
          headerLeft: <HeaderLeft {...props} />,
          headerRight: <HeaderRight {...props} />,
          headerTitle: <HeaderTitle {...props} />
        };
      };

    constructor(props){
        super(props);
        this.videoReplyPagination = new Pagination( this._fetchUrlVideoReplies() );
        this.paginationEvent = this.videoReplyPagination.event;

        this.state = {
          list :  this.videoReplyPagination.getList(),
          refreshing : false,
          loadingNext: false
        }
        this.listRef = null ;
    }

    componentDidMount(){
        this.paginationEvent.on("onBeforeRefresh" , this.beforeRefresh.bind(this) );
        this.paginationEvent.on("onRefresh" ,  this.onRefresh.bind(this) );
        this.paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this));
        this.paginationEvent.on("onBeforeNext" , this.beforeNext.bind(this));
        this.paginationEvent.on("onNext" , this.onNext.bind(this) );
        this.paginationEvent.on("onNextError" , this.onNextError.bind(this));
        if( this.props.refreshEvent) {
          this.props.refreshEvent.on("refresh" , ()=> {
            this.listRef.scrollToOffset({offset: 0});
            this.refresh();
          });
        }
        this.videoReplyPagination.initPagination();
    }

    componentWillUnmount(){
        this.paginationEvent.removeListener('onBeforeRefresh');
        this.paginationEvent.removeListener('onRefresh');
        this.paginationEvent.removeListener('onRefreshError');
        this.paginationEvent.removeListener('onBeforeNext');
        this.paginationEvent.removeListener('onNext');
        this.paginationEvent.removeListener('onNextError');
        if( this.props.refreshEvent) {
          this.props.refreshEvent.removeListener("refresh");
        }
    }

    _fetchUrlVideoReplies(){
      const userId = this.props.navigation.getParam('userId');
      return `/users/${userId}/video-history`;
    }

    getVideoBtAmount(videoId){
      return Pricer.displayAmountWithKFomatter( Pricer.getFromDecimal( reduxGetters.getVideoBt(videoId) ) ) ;
    }

    onPullToRefresh = () => {
      fetchUser(this.props.userId , this.onUserFetch );
    }

    onUserFetch =(res) => {
      this.props.onUserFetch && this.props.onUserFetch(res);
    }

    beforeRefresh = ( ) => {
        this.props.beforeRefresh && this.props.beforeRefresh();
        this.onPullToRefresh();
        this.setState({ refreshing : true });
    }

    onRefresh = ( res ) => {
        const list = this.videoReplyPagination.getList()  ;
        this.props.onRefresh && this.props.onRefresh( list , res );
        this.setState({ refreshing : false , list : list });
    }

    onRefreshError = ( error ) => {
        this.setState({ refreshing : false });
    }

    beforeNext =() => {
        this.setState({ loadingNext : true });
    }

    onNext = ( res  ) => {
        this.setState({ loadingNext : false ,  list : this.videoReplyPagination.getList() });
    }

    onNextError = ( error ) => {
        this.setState({ loadingNext : false });
    }

    getNext = () => {
      this.videoReplyPagination.getNext();
    }

    refresh = () => {
      this.videoReplyPagination.refresh();
    }

    isCurrentUser = () => {
        return this.props.userId === CurrentUser.getUserId();
    }

    removeVideo = (videoId, index) => {
        if (index > -1) {
            this.videoReplyPagination.deleteItem(videoId , "payload.video_id");
            let array = [...this.state.list]; // make a separate copy of the array
            array.splice(index, 1);
            this.setState({list: array});
            this.props.onDelete(array);
        }
    }

    _keyExtractor = (item, index) => `id_${item}`;

    _renderItem = ({ item, index }) => {
      const videoId = reduxGetters.getUserVideoId(item),
            imageUrl = reduxGetters.getVideoImgUrl( videoId,  null , AppConfig.userVideos.userScreenCoverImageWidth ) ;
      return (
        <TouchableWithoutFeedback onPress={multipleClickHandler(() => { this.onVideoClick( item, index ); } )}
        >
          <View>

            <FastImage style={{
                width: (Dimensions.get('window').width - 6) / 2,
                aspectRatio:9/16,
                margin: 1,
                backgroundColor: imageUrl ? Colors.white : Colors.gainsboro
            }}
                       source={{
                        uri: imageUrl,
                        priority: FastImage.priority.high
                       }}/>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.3)', 'transparent', 'transparent']}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{width: (Dimensions.get('window').width - 6) / 2, margin: 1, position: 'absolute', top: 0, left: 0, alignItems: 'flex-end'}}
            >
                { this.isCurrentUser() && <View style={inlineStyles.deleteButton}>
                <DeleteVideo videoId={videoId} removeVideo={ (videoId) => {this.removeVideo(videoId , index )}} />
              </View>}
            </LinearGradient>
            <LinearGradient
              colors={['transparent', 'transparent', 'rgba(0, 0, 0, 0.3)']}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{width: (Dimensions.get('window').width - 6) / 2, margin: 1, position: 'absolute', bottom: 0, left: 0}}
            >
              <View style={inlineStyles.videoStatsContainer}>
                <Image style={{height: 15, width: 15}} source={pepoWhiteIcon} />
                <Text style={inlineStyles.videoStatsTxt}>{this.getVideoBtAmount(videoId)}</Text>
              </View>
            </LinearGradient>

          </View>
        </TouchableWithoutFeedback>
      );
    };

    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
     };

    onVideoClick = ( item, index  ) => {
        const clonedInstance = this.videoReplyPagination.fetchServices.cloneInstance();
        this.props.navigation.push("VideoReplyList", {
          fetchServices : clonedInstance,
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
                    ref={(ref)=>  {this.listRef = ref } }
                    ListHeaderComponent={this.listHeaderComponent()}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    onRefresh={this.refresh}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={9}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderFooter}
                    numColumns={2}
                />
            </SafeAreaView>
        );
    }

}

export default VideoRepliesScreen;
