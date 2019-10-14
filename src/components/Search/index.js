import React, { PureComponent } from 'react';
import {View} from "react-native";
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import CurrentUser from '../../models/CurrentUser';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import UserProfileFlatList from '../CommonComponents/UserProfileFlatList';
import SearchListHeader from "./SearchListHeader";
import styles from './styles';
import NativeBaseTabTheme from "../../theme/styles/NativeBaseTabs";
import TagsList from '../../components/TagsList'
const TabMap = [
  {
    baseUrl: '/search/top',
    title: 'Top'
  },
  {

    baseUrl : '/search/users',
    title: 'People'
  },
  {
    baseUrl : '/search/tags',
    title: 'Tags'
  }
];




const mapStateToProps = (state) => {
  return {
    userId: CurrentUser.getUserId()
  };
};

class SearchScreen extends PureComponent {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null,
      headerBackTitle: null
    };
  };
  constructor(props) {
    super(props);
    this.currentIndex = 0;
    this.topBaseUrl = TabMap[0].baseUrl;
    this.peopleUrl = TabMap[1].baseUrl;
    this.tagsUrl = TabMap[2].baseUrl;
    this.defaultState = {
      searchTagsParams: '',
      // refresh: true,
      noResultsFound: false
    };
    this.state = this.defaultState;
  }

  componentDidUpdate(){
    if(!this.props.userId){
      this.setState({ ...this.defaultState });
    }
  }

  topSearchHandler(searchParams){

  }

  peopleSearchHandler(searchParams){

  }

  tagsSearchHandler(searchTagsParams){
    this.setState({searchTagsParams});
    let newUrl = `${TabMap[2].baseUrl}?q=${searchTagsParams}`;
    if (this.tagsUrl !== newUrl){
      this.tagsListRef.forcedRefresh(newUrl);
    }
  }

  // shouldMakeApiCall = () => {
  //   switch (this.currentIndex) {
  //     case 0:
  //       // this.topSearchHandler(searchParams);
  //       break;
  //     case 1:
  //       // this.peopleSearchHandler(searchParams);
  //       break;
  //     case 2:
  //       return Boolean(this.searchTagsParams);
  //       // this.tagsSearchHandler(searchParams);
  //   }
  // }




  setSearchParams = (searchParams) => {
      switch (this.currentIndex) {
        case 0:
          this.topSearchHandler(searchParams);
          break;
        case 1:
          this.peopleSearchHandler(searchParams);
          break;
        case 2:
          this.tagsSearchHandler(searchParams);
          break;
      }
  };

  // onRefresh = (result) => {
  //   let noResultsFound = result && result.length === 0;
  //   this.setState({
  //     refresh: false,
  //     noResultsFound
  //   });
  // };

  // shouldMakeApiCall = (searchParams) => {
  //   //if(searchParams == "") return true;
  //   searchParams = searchParams || this.state.searchParams;
  //   if (searchParams.length == 1) {
  //     return false;
  //   }
  //   return true;
  // };

  render() {
    const tabStyle = NativeBaseTabTheme.tab;
    const scTabStyle = NativeBaseTabTheme.scrollableTab;

    return this.props.userId && ( 
      <SafeAreaView style={styles.container}> 
            <SearchListHeader setSearchParams={this.setSearchParams} />
            <Tabs renderTabBar={()=> 
                  <ScrollableTab 
                  //  style={{marginHorizontal: 10}}
                  tabsContainerStyle={scTabStyle.tabsContainerStyle} 
                  underlineStyle={scTabStyle.underlineStyle} />}
                  onChangeTab={this.onChangeTab}
                  initialPage={this.currentIndex}
                  >
              <Tab heading={TabMap[0].title} textStyle={tabStyle.textStyle}
                                activeTextStyle={tabStyle.activeTextStyle} 
                                activeTabStyle={tabStyle.activeTabStyle}
                                tabStyle={tabStyle.tabStyle}
                                style={tabStyle.style}>
                <UserProfileFlatList userId={"1710"}/> 
              </Tab>
              <Tab heading={TabMap[1].title} textStyle={tabStyle.textStyle}
                                activeTextStyle={tabStyle.activeTextStyle} 
                                activeTabStyle={tabStyle.activeTabStyle}
                                tabStyle={tabStyle.tabStyle}
                                style={tabStyle.style}>
                <UserProfileFlatList userId={"1710"}/>
              </Tab>
              <Tab heading={TabMap[2].title} textStyle={tabStyle.textStyle}
                                activeTextStyle={tabStyle.activeTextStyle} 
                                activeTabStyle={tabStyle.activeTabStyle}
                                tabStyle={tabStyle.tabStyle}
                                style={tabStyle.style}>
                <TagsList ref={(elem) => this.tagsListRef = elem } getFetchUrl={this.getTagsUrl}  searchParams={this.state.searchTagsParams} />
              </Tab>
            </Tabs>
    </SafeAreaView>  
    );
  }

  getTagsUrl = () => {
    return this.tagsUrl;
  }

  getPeopleUrl = () => {
    return this.peopleUrl;
  }

  onChangeTab = (args) => {
    this.currentIndex = args.i
    console.log('---onChangeTab----', args);
  }
}

export default connect(mapStateToProps)(SearchScreen);