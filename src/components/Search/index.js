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
import TagsList from '../../components/TagsList';
import PeopleList from '../../components/PeopleList';
import qs from 'qs';
import VideoCollections from "../VideoCollections";
import TopsList from "../TopsList";
import EmptySearchResult from '../../components/CommonComponents/EmptySearchResult';

const TabMap = {
  "top": {
    id: 'top',
    baseUrl: '/search/top',
    title: 'Top',
    "params": {
      "supported_entities": ["users", "tags"]
    },
    "queryParam": "q",
    "noResultsData": {
      "noResultsMsg": 'No results found. Please try again.',
      "isEmpty": true
    },
    renderNoResults :  (noResultsData) => {
      const oThis = TabMap.top;
      console.log('this.emptyData',oThis.noResultsData);
      noResultsData = noResultsData || oThis.noResultsData;
      return <EmptySearchResult  noResultsData={noResultsData}/>
    }
  },
  "people": {
    id: 'people',
    baseUrl : '/search/users',
    title: 'People',
    "queryParam": "q",
    "noResultsData": {
      "noResultsMsg": 'No results found. Please try again.',
      "isEmpty": true
    },
    renderNoResults :  (noResultsData) => {
      const oThis = TabMap.people;
      console.log('this.emptyData',oThis.noResultsData);
      noResultsData = noResultsData || oThis.noResultsData;
      return <EmptySearchResult  noResultsData={noResultsData}/>
    }
  },
  "tags": {
    id: 'tags',
    baseUrl : '/search/tags',
    title: 'Tags',
    "queryParam": "q",
    "noResultsData": {
      "noResultsMsg": 'No results found. Please try again.',
      "isEmpty": true
    },
    renderNoResults:  (noResultsData) => {
      const oThis = TabMap.tags;
      console.log('this.emptyData',oThis.noResultsData);
      noResultsData = noResultsData || oThis.noResultsData;
      return <EmptySearchResult  noResultsData={noResultsData}/>
    }
  },
  "video": {
    id: 'video',
    baseUrl : '/tags/52/videos',
    title: 'Video',
    "queryParam": "q",
    "noResultsData": {
      "noResultsMsg": 'No results found. Please try again.',
      "isEmpty": true
    },
    renderNoResults :  (noResultsData) => {
      const oThis = TabMap.video;
      console.log('this.emptyData',oThis.noResultsData);
      noResultsData = noResultsData || oThis.noResultsData;
      return <EmptySearchResult  noResultsData={noResultsData}/>
    }
  }
};

const TabsArray = [TabMap.top, TabMap.people, TabMap.tags, TabMap.video];

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
    this.initReferences();
  }

  isUserLoggedIn(){
    return Boolean(this.props.userId);
  }

  isUserUpdated(prevProps){
    return prevProps.userId !== this.props.userId;
  }


  componentDidUpdate(prevProps){
    if(this.isUserUpdated(prevProps)) {
      this.initReferences();
    }
  }

  initReferences = () =>{
    this.currentIndex = 0;
    this.currentSearchTerm = "";
    this.searchListHeaderRef = null;
    if ( this.flatLists ) {
      for (let key in this.flatLists) { if ( this.flatLists.hasOwnProperty( key ) ) {
        this.flatLists[key] = null;
      }};
    }
    this.flatLists = {};
  };


  // region - search header methods and delegates
  setSearchListHeaderRef = ( searchListHeaderRef ) => {
    this.searchListHeaderRef = searchListHeaderRef;
    //Future: if we have default search string, set it using searchListHeaderRef.setNativeProps
  };

  setSearchParams = (searchParams) => {
    this.currentSearchTerm = searchParams;
    this.refreshResults();
  };

  refreshResults = () => {
    let tabIndx = this.currentIndex;
    let tabData = TabsArray[ tabIndx ];
    let currentTabUrl = this.getTabUrlForIndex( tabIndx );
    let newTabUrl = this.getUrlForTab( tabData );

    if ( !currentTabUrl || currentTabUrl !== newTabUrl ) {
      // Force refresh
      let tabFlatList = this.getTabFlatList( tabIndx );
      tabFlatList.forcedRefresh(newTabUrl);
    } else {
      // Ignore.
    }
  };


  getTabUrlForIndex = ( tabIndx ) => {
    // Get the pagination from tab and get the url from pagination.
    let tabFlatList = this.getTabFlatList( tabIndx );
    if ( !tabFlatList ) {
      return null;
    }
    console.log(tabFlatList, 'tabFlatListtabFlatListtabFlatListtabFlatListtabFlatList');
    let paginationInstance = tabFlatList.getPagination();
    if ( !paginationInstance ) {
      return  null;
    }
    return paginationInstance.fetchUrl;
  };

  getTabFlatList = ( tabIndx ) => {
    let tabData = TabsArray[ tabIndx ];
    let tabId = tabData.id;
    return this.flatLists[ tabId ];
  };
  // endregion

  // region - Get Url for Tabs
  getTopTabUrl = () => {
    return this.getUrlForTab(TabMap.top);
  };

  getTagsTabUrl = () => {
    return this.getUrlForTab(TabMap.tags);
  };

  getPeopleTabUrl = () => {
    return this.getUrlForTab(TabMap.people);
  };

  getVideoTabUrl = () => {
    return this.getUrlForTab(TabMap.video);
  };

  getUrlForTab = (tabData) => {
    let baseUrl = tabData.baseUrl;

    let params = tabData.params || {};
    // Copy it.
    params = Object.assign({}, params);

    // Add query string
    params[ tabData.queryParam ] = this.currentSearchTerm;

    // Update when there is a bug.
    return baseUrl + "?" + qs.stringify(params);
  };
  // endregion

  // region - Tab Flatlist Management

  setTopFlatListRef = ( elemRef ) => {
    this.flatLists = this.flatLists || {};

    let tabData = TabMap.top;
    let tabId = tabData.id;
    this.flatLists[ tabId ] = elemRef;
  };
  setPeopleFlatListRef = (elemRef) => {
    this.flatLists = this.flatLists || {};

    let tabData = TabMap.people;
    let tabId = tabData.id;
    this.flatLists[ tabId ] = elemRef;
  };
  setTagsFlatListRef = (elemRef) => {
    console.log('elemRefelemRef', elemRef);
    this.flatLists = this.flatLists || {};

    let tabData = TabMap.tags;
    let tabId = tabData.id;
    this.flatLists[ tabId ] = elemRef;
  };
  setVideoFlatListRef = (elemRef) => {
    this.flatLists = this.flatLists || {};

    let tabData = TabMap.video;
    let tabId = tabData.id;
    this.flatLists[ tabId ] = elemRef;
  };

  // endregion

  onChangeTab = (args) => {
    this.currentIndex = args.i;
    this.refreshResults();
  }

  render() {
    if (this.isUserLoggedIn()){
      return this.renderLoggedInView();
    } else {
      return this.renderLoggedOutView()
    }
  }

  renderLoggedOutView = () => {
    return <View />
  }

  renderTabBar = () => {
    const scTabStyle = NativeBaseTabTheme.scrollableTab;
    return (<ScrollableTab
        //  style={{marginHorizontal: 10}}
        tabsContainerStyle={scTabStyle.tabsContainerStyle}
        underlineStyle={scTabStyle.underlineStyle} />
    );
  }

  renderLoggedInView = () => {
    const tabStyle = NativeBaseTabTheme.tab;
    return <SafeAreaView style={styles.container}>
      <SearchListHeader setSearchParams={this.setSearchParams} ref={this.setSearchListHeaderRef} />
      <Tabs renderTabBar={this.renderTabBar}  onChangeTab={this.onChangeTab}>
        <Tab heading={TabMap.top.title} textStyle={tabStyle.textStyle}
             activeTextStyle={tabStyle.activeTextStyle}
             activeTabStyle={tabStyle.activeTabStyle}
             tabStyle={tabStyle.tabStyle}
             style={tabStyle.style}>
          <TopsList
            getFetchUrl={this.getTopTabUrl}
            ref={this.setTopFlatListRef}
            noResultsData={TabMap.top.noResultsData}
            getNoResultsCell={TabMap.top.renderNoResults}
          />
        </Tab>
        <Tab heading={TabMap.people.title} textStyle={tabStyle.textStyle}
             activeTextStyle={tabStyle.activeTextStyle}
             activeTabStyle={tabStyle.activeTabStyle}
             tabStyle={tabStyle.tabStyle}
             style={tabStyle.style}>
          <PeopleList
            getFetchUrl={this.getPeopleTabUrl}
            ref={this.setPeopleFlatListRef}
            noResultsData={TabMap.people.noResultsData}
            getNoResultsCell={TabMap.people.renderNoResults}
          />
        </Tab>
        <Tab heading={TabMap.tags.title} textStyle={tabStyle.textStyle}
             activeTextStyle={tabStyle.activeTextStyle}
             activeTabStyle={tabStyle.activeTabStyle}
             tabStyle={tabStyle.tabStyle}
             style={tabStyle.style} >
          <TagsList
            getFetchUrl={this.getTagsTabUrl}
            ref={this.setTagsFlatListRef}
            noResultsData={TabMap.tags.noResultsData}
            getNoResultsCell={TabMap.tags.renderNoResults}
          />
        </Tab>
        <Tab heading={TabMap.video.title} textStyle={tabStyle.textStyle}
             activeTextStyle={tabStyle.activeTextStyle}
             activeTabStyle={tabStyle.activeTabStyle}
             tabStyle={tabStyle.tabStyle}
             style={tabStyle.style}>

          <VideoCollections
            ref={this.setVideoFlatListRef}
            getFetchUrl={this.getVideoTabUrl}
            navigation={this.props.navigation}
            noResultsData={TabMap.video.noResultsData}
            getNoResultsCell={TabMap.video.renderNoResults}
          />
        </Tab>


      </Tabs>
    </SafeAreaView>

  }
}

export default connect(mapStateToProps)(SearchScreen);