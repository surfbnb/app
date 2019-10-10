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
    this.defaultState =  {
      searchParams: 'ash',
      refresh: true,
      noResultsFound: false
    };
    this.state = this.defaultState;
  }

  componentDidUpdate(){
    if(!this.props.userId){
      this.setState({...this.defaultState});
    }
  }

  setSearchParams = (searchParams) => {
    this.setState({
      searchParams: searchParams ? encodeURIComponent(searchParams) : '',
      refresh: this.shouldMakeApiCall(searchParams)
    });
  };

  onRefresh = (result) => {
    let noResultsFound = result && result.length === 0;
    this.setState({
      refresh: false,
      noResultsFound
    });
  };

  shouldMakeApiCall = (searchParams) => {
    if(searchParams == "") return true;
    searchParams = searchParams || this.state.searchParams;
    if (searchParams.length == 1) {
      return false;
    }
    return true;
  };

  render() {
    const tabStyle = NativeBaseTabTheme.tab;
    const scTabStyle = NativeBaseTabTheme.scrollableTab;

    return this.props.userId && ( 
      <SafeAreaView style={styles.container}> 
            <SearchListHeader />
            <Tabs renderTabBar={()=> 
                  <ScrollableTab 
                  //  style={{marginHorizontal: 10}}
                  tabsContainerStyle={scTabStyle.tabsContainerStyle} 
                  underlineStyle={scTabStyle.underlineStyle} />} 
                  >
              <Tab heading="Top" textStyle={tabStyle.textStyle}
                                activeTextStyle={tabStyle.activeTextStyle} 
                                activeTabStyle={tabStyle.activeTabStyle}
                                tabStyle={tabStyle.tabStyle}
                                style={tabStyle.style}>
                <UserProfileFlatList userId={"1710"}/> 
              </Tab>
              <Tab heading="Pepole" textStyle={tabStyle.textStyle}
                                activeTextStyle={tabStyle.activeTextStyle} 
                                activeTabStyle={tabStyle.activeTabStyle}
                                tabStyle={tabStyle.tabStyle}
                                style={tabStyle.style}>
                <UserProfileFlatList userId={"1710"}/>
              </Tab>
              <Tab heading="Tags" textStyle={tabStyle.textStyle}
                                activeTextStyle={tabStyle.activeTextStyle} 
                                activeTabStyle={tabStyle.activeTabStyle}
                                tabStyle={tabStyle.tabStyle}
                                style={tabStyle.style}>
                <UserProfileFlatList userId={"1710"}/>
              </Tab>
            </Tabs>
    </SafeAreaView>  
    );
  }
}

export default connect(mapStateToProps)(SearchScreen);