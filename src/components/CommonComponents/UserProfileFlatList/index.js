import React, { PureComponent } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {SafeAreaView,withNavigation} from "react-navigation";
import {
  Tabs,
  ScrollableTab, Tab
} from 'native-base';

import reduxGetters from "../../../services/ReduxGetters";
import Pricer from '../../../services/Pricer';
import Pagination from "../../../services/Pagination";
import {fetchUser} from "../../../helpers/helpers";
import NativeBaseTabTheme from "../../../theme/styles/NativeBaseTabs";

import inlineStyles from './style';
import LinearGradient from "react-native-linear-gradient";
import CurrentUser from "../../../models/CurrentUser";
import DeleteVideo from "../DeleteVideo";
import CommonStyle from "../../../theme/styles/Common"
const tabStyle = NativeBaseTabTheme.tab;
import PostsTabBar from '../../PostTabBar';
import RepliesTabBar from '../../RepliesTabBar';


class UserProfileFlatList extends PureComponent {
    constructor(props){
        super(props);
        // this.videoHistoryPagination = new Pagination( this._fetchUrlVideoHistory() );
        // this.paginationEvent = this.videoHistoryPagination.event;

        this.state = {
          // list :  this.videoHistoryPagination.getList(),
          refreshing : false,
          loadingNext: false
        }
        this.listRef = null ;
    }

    // componentDidMount(){
        // this.paginationEvent.on("onBeforeRefresh" , this.beforeRefresh.bind(this) );
        // this.paginationEvent.on("onRefresh" ,  this.onRefresh.bind(this) );
        // this.paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this));
        // this.paginationEvent.on("onBeforeNext" , this.beforeNext.bind(this));
        // this.paginationEvent.on("onNext" , this.onNext.bind(this) );
        // this.paginationEvent.on("onNextError" , this.onNextError.bind(this));
        // this.videoHistoryPagination.initPagination();
    // }

    // forceRefresh(){
    //   this.listRef.scrollToOffset({offset: 0});
    //   this.refresh();
    // }

    // componentWillUnmount(){
        // this.paginationEvent.removeListener('onBeforeRefresh');
        // this.paginationEvent.removeListener('onRefresh');
        // this.paginationEvent.removeListener('onRefreshError');
        // this.paginationEvent.removeListener('onBeforeNext');
        // this.paginationEvent.removeListener('onNext');
        // this.paginationEvent.removeListener('onNextError');
        // if( this.props.refreshEvent) {
        //   this.props.refreshEvent.removeListener("refresh");
        // }
    // }

    // _fetchUrlVideoHistory(){
    //     return `/users/${this.props.userId}/video-history` ;
    // }

    // getVideoBtAmount(videoId){
    //   return Pricer.displayAmountWithKFomatter( Pricer.getFromDecimal( reduxGetters.getVideoBt(videoId) ) ) ;
    // }

  // beforeRefresh = ( ) => {
  //     this.props.beforeRefresh && this.props.beforeRefresh();
  //     this.onPullToRefresh();
  //     this.setState({ refreshing : true });
  // }
  onPullToRefresh = () => {
    this.setState({ refreshing : true });
    fetchUser(this.props.userId , this.onUserFetch );
  }
  onUserFetch =(res) => {
    this.props.onUserFetch && this.props.onUserFetch(res);
    this.onRefresh();
  }

    onRefresh = ( res ) => {
        // const list = this.videoHistoryPagination.getList()  ;
        // this.props.onRefresh && this.props.onRefresh( list , res );
        this.setState({ refreshing : false });
    }

    // onRefreshError = ( error ) => {
    //     this.setState({ refreshing : false });
    // }

    // beforeNext =() => {
    //     this.setState({ loadingNext : true });
    // }

    // onNext = ( res  ) => {
    //     this.setState({ loadingNext : false ,  list : this.videoHistoryPagination.getList() });
    // }

    // onNextError = ( error ) => {
    //     this.setState({ loadingNext : false });
    // }

    // getNext = () => {
    //   this.videoHistoryPagination.getNext();
    // }

    // refresh = () => {
    //   this.videoHistoryPagination.refresh();
    // }

  _keyExtractor = (item, index) => `id_${item}`;

  showPostsTabBar = () => {
    return(
      <Tab heading="Posts" textStyle={tabStyle.textStyle}
           activeTextStyle={tabStyle.activeTextStyle}
           activeTabStyle={tabStyle.activeTabStyle}
           tabStyle={tabStyle.tabStyleSkipFont}
           style={tabStyle.style}>
        <PostsTabBar userId={this.props.userId}/>
      </Tab>
    )
  }

  showRepliesTabBar = () => {
    return(
      <Tab heading="Replies" textStyle={tabStyle.textStyle}
           activeTextStyle={tabStyle.activeTextStyle}
           activeTabStyle={tabStyle.activeTabStyle}
           tabStyle={tabStyle.tabStyleSkipFont}
           style={tabStyle.style}>
        <RepliesTabBar userId={this.props.userId}/>
      </Tab>
    )
  }

  _renderItem = () =>{
    return(
      <Tabs renderTabBar={this.renderTabBar}>
        {this.showPostsTabBar()}
        {this.showRepliesTabBar()}
      </Tabs>
     )
  }

    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
     };



    listHeaderComponent = () => {
      return (
        <React.Fragment>
          {this.props.listHeaderComponent}
          {/* TODO: we don't have any idea of list length here*/}
          {/*{this.state.list.length > 0 && this.props.listHeaderSubComponent }*/}
        </React.Fragment>
      )
    }

  renderTabBar = () => {
    const scTabStyle = NativeBaseTabTheme.scrollableTab;
    return (<ScrollableTab
        tabsContainerStyle={scTabStyle.tabsContainerStyleSkipFont}
        underlineStyle={scTabStyle.underlineStyleSkipFont} />
    );
  }

  render(){
    return (
    <SafeAreaView style={CommonStyle.viewContainer}>
      <FlatList
        ref={(ref) => {
          this.listRef = ref
        }}
        ListHeaderComponent={this.listHeaderComponent()}
        data={'h'}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListFooterComponent={this.renderFooter}
        numColumns={1}
        onRefresh = {this.onPullToRefresh}
        refreshing = {this.state.refreshing}
      />
    </SafeAreaView>
  )
}

}

export default withNavigation( UserProfileFlatList );
