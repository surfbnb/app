import React, { PureComponent } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  RefreshControl
} from "react-native";
import {SafeAreaView,withNavigation} from "react-navigation";
import {
  Tabs,
  ScrollableTab, Tab
} from 'native-base';
import {fetchUser} from "../../../helpers/helpers";
import NativeBaseTabTheme from "../../../theme/styles/NativeBaseTabs";
import CommonStyle from "../../../theme/styles/Common";
import PostsTabBar from '../../PostTabBar';
import RepliesTabBar from '../../RepliesTabBar';

const tabStyle = NativeBaseTabTheme.tab;

class UserProfileFlatList extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
          refreshing : false,
        };
        this.scrollViewRef = null ;
    }
  onPullToRefresh = () => {
    this.setState({ refreshing : true });
    fetchUser(this.props.userId , this.onUserFetch );
    this.postsListRef && this.postsListRef.refresh();
    this.repliesListRef && this.repliesListRef.refresh();
  }

  onUserFetch =(res) => {
    this.props.onUserFetch && this.props.onUserFetch(res);
    this.onRefresh();
  }

  forceRefresh(){
    //scroll to top and also refresh flatlists
    this.scrollViewRef.scrollTo({x:0,y:0});
    this.postsListRef && this.postsListRef.refresh();
    this.repliesListRef && this.repliesListRef.refresh();
  }

  onRefresh = ( res ) => {
    this.setState({ refreshing : false });
    this.postsListRef && this.postsListRef.onRefresh();
    this.repliesListRef && this.repliesListRef.onRefresh();
  }

  showPostsTabBar = () => {
    return(
      <Tab heading="Posts" textStyle={tabStyle.textStyle}
           activeTextStyle={tabStyle.activeTextStyle}
           activeTabStyle={tabStyle.activeTabStyle}
           tabStyle={tabStyle.tabStyleSkipFont}
           style={tabStyle.style}>
        <PostsTabBar onRef={(ref) =>{this.postsListRef = ref}} userId={this.props.userId}/>
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
        <RepliesTabBar onRef={(ref) =>{this.repliesListRef = ref}} userId={this.props.userId}/>
      </Tab>
    )
  }

  renderTabs = () =>{
    return(
      <Tabs renderTabBar={this.renderTabBar}>
        {this.showPostsTabBar()}
        {this.showRepliesTabBar()}
      </Tabs>
     )
  }
  listHeaderComponent = () => {
      return (
        <React.Fragment>
          {this.props.listHeaderComponent}
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
      <ScrollView
        ref = {(ref)=>{this.scrollViewRef = ref}}
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onPullToRefresh} />
        }
      >
        {this.listHeaderComponent()}
        {this.renderTabs()}
      </ScrollView>
    </SafeAreaView>
  )
}

}

export default withNavigation( UserProfileFlatList );
