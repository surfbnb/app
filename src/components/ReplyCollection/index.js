import React, { PureComponent } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Dimensions,
  View
} from "react-native";
import { withNavigation} from "react-navigation";
import deepGet from "lodash/get";
import LinearGradient from "react-native-linear-gradient";

import Pagination from "../../services/Pagination";
import DeleteVideo from "../CommonComponents/DeleteVideo";
import inlineStyles from './styles';
import CurrentUser from '../../models/CurrentUser';
import DataContract from '../../constants/DataContract';
import { VideoReplyEmitter } from '../../helpers/Emitters';
import PepoApi from '../../services/PepoApi';
import ReplyThumbnail from '../CommonComponents/VideoThumbnail/ReplyThumbnail';
import ReduxGetters from '../../services/ReduxGetters';
import entityHelper from '../../helpers/EntityHelper';


class ReplyCollection extends PureComponent {

    constructor(props){
      super(props);
        this.state = {
            list : [],
            refreshing : true,
            loadingNext: false
        };
        this.listRef = null;
        this.numColumns = 2;
    }

    componentDidMount(){
        this.initPagination();
        this.refresh();
        this.bindEvents();
    }

    bindEvents(){
        VideoReplyEmitter.on('videoUploaded', ( payload )=>{
            this.fetchVideoReply( payload.videoId );
        })
    }

    fetchVideoReply = (id)=> {
        new PepoApi(DataContract.replies.getSingleVideoReplyApi(id))
        .get()
        .then((res)=> {
            let newVideoReply  = res.data['result_type'];
            this.addVideo( newVideoReply );
        })
    }

    addVideo = ( item ) => {
        this.videoPagination.addItems( item );
        let array = [...this.state.list]; // make a separate copy of the array
        array.unshift( item );
        this.setState({list: array});
    }

    componentWillUnmount() {
        this.removePaginationListeners();
    }

    getPagination = () => {
        return this.videoPagination;
    };


    initPagination() {
        // First, take care of existing Pagination if exists.
        this.removePaginationListeners();

        // Now, create a new one.
        let fetchUrl = this.props.fetchUrl;
        this.videoPagination = new Pagination(fetchUrl);
        this.bindPaginationEvents();
    }

    bindPaginationEvents(){
        let pagination = this.videoPagination;
        if ( !pagination ) {
            return;
        }
        let paginationEvent = pagination.event;
        if ( null === paginationEvent ) {
            return;
        }

        paginationEvent.on("onBeforeRefresh" , this.beforeRefresh.bind(this) );
        paginationEvent.on("onRefresh" ,  this.onRefresh.bind(this) );
        paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this));
        paginationEvent.on("onBeforeNext" , this.beforeNext.bind(this));
        paginationEvent.on("onNext" , this.onNext.bind(this) );
        paginationEvent.on("onNextError" , this.onNextError.bind(this));
    }

    removePaginationListeners(){
        let pagination = this.videoPagination;
        if ( !pagination ) {
            return;
        }
        let paginationEvent = pagination.event;
        if ( null === paginationEvent ) {
            return;
        }
        paginationEvent.removeListener('onBeforeRefresh');
        paginationEvent.removeListener('onRefresh');
        paginationEvent.removeListener('onRefreshError');
        paginationEvent.removeListener('onBeforeNext');
        paginationEvent.removeListener('onNext');
        paginationEvent.removeListener('onNextError');
    }

    beforeRefresh = ( ) => {
        this.setState({ refreshing : true });
    };

    onRefresh = ( res ) => {
        const list = this.getResultList();
        this.props.onRefresh && this.props.onRefresh( list , res );
        this.setState({
          refreshing : false,
          list : list
        });
    };

    onRefreshError = ( error ) => {
        this.setState({ refreshing : false });
    };

    beforeNext =() => {
        this.setState({ loadingNext : true });
    };

    onNext = ( res  ) => {
        this.setState({
          loadingNext : false,
          list : this.getResultList()
        });
    }

    onNextError = ( error ) => {
        this.setState({ loadingNext : false });
    };

    getNext = () => {
        this.videoPagination.getNext();
    };

    refresh = () => {
        this.videoPagination.refresh();
    };

    _keyExtractor = (item, index) => {
        return `id_${item.id}`;
    }

    _renderItem = ({ item, index }) => {
        // Render Video cell
        return this._renderVideoCell({item,index});
    };

    _renderVideoCell = ({ item, index }) => {
        return this.renderThumbnailItem(item , index)
    };

    renderThumbnailItem ( item , index ){
       if(entityHelper.isVideoReplyEntity( item )){
           if(entityHelper.isReplyVideoTypeEntity(item)){
            return this._renderVideoReplyThumbnail( item, index );
           }
       }           
    }

    _renderVideoReplyThumbnail( item, index ) {
        const userId = deepGet(item, "payload.user_id");
        const reply_detail_id = deepGet(item,`payload.${DataContract.replies.replyDetailIdKey}`);
        const videoId = ReduxGetters.getReplyEntityId(reply_detail_id);
        return (<View style={{position: 'relative'}}>
        {this.isCurrentUser( userId ) && <LinearGradient
             colors={['rgba(0, 0, 0, 0.3)', 'transparent', 'transparent']}
             locations={[0, 0.5, 1]}
             start={{ x: 0, y: 0 }}
             end={{ x: 0, y: 1 }}
             style={{width: (Dimensions.get('window').width - 6) / 2, margin: 1, position: 'absolute', top: 0, left: 0, zIndex: 1, alignItems: 'flex-end'}}
           >
           <View style={inlineStyles.deleteButton}>
               <DeleteVideo fetchUrl={DataContract.replies.getDeleteVideoReplyApi(videoId)} videoId={videoId} removeVideo={ (videoId) => {this.removeVideo(videoId , index )}} />
           </View>
         </LinearGradient>}
            <ReplyThumbnail  payload={item.payload}  index={index} onVideoClick={() => {this.onVideoClick(index)}}/>
          </View>);
    }

    isCurrentUser = ( userId ) => {
        return userId === CurrentUser.getUserId();
    }

    removeVideo = (videoId, index) => {
        if (index > -1) {
            this.videoPagination.deleteItem(videoId , "payload.reply_detail_id");
            let array = [...this.state.list]; // make a separate copy of the array
            array.splice(index, 1);
            this.setState({list: array});
        }
    }

    onVideoClick = ( index ) => {
        const clonedInstance = this.videoPagination.fetchServices.cloneInstance();
        this.props.navigation.push("FullScreenReplyCollection", {
            "fetchServices" : clonedInstance,
            "currentIndex": index,
            "baseUrl": this.props.fetchUrl
        });
    }


    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
    };

    getResultList(){
      return this.videoPagination.getResults();
    }

    scrollToTop(){
        this.listRef.scrollToOffset({offset: 0});
    }

    setListRef = (listRef) => {
      this.listRef = listRef;
    };

    render(){
        return (
            <FlatList
                contentContainerStyle={{paddingBottom: this.props.listBottomPadding}}
                style={{flex:1, width: "100%"}}
                ref={this.setListRef}
                data={this.state.list}
                onEndReached={this.getNext}
                onRefresh={this.refresh}
                keyExtractor={this._keyExtractor}
                refreshing={this.state.refreshing}
                onEndReachedThreshold={4}
                renderItem={this._renderItem}
                ListFooterComponent={this.renderFooter}
                numColumns={this.numColumns}
            />
        );
    }

}

export default  withNavigation( ReplyCollection );
