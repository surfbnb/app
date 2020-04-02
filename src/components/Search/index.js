import React, { PureComponent } from 'react';
import {SafeAreaView} from "react-native";
import { connect } from 'react-redux';
import CurrentUser from '../../models/CurrentUser';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import SearchListHeader from "./SearchListHeader";
import styles from './styles';
import NativeBaseTabTheme from "../../theme/styles/NativeBaseTabs";
import TagsList from '../../components/TagsList';
import PeopleList from '../../components/PeopleList';
import qs from 'qs';
import VideoCollections from "../VideoCollections";
import TopsList from "../TopsList";
import EmptySearchResult from '../../components/CommonComponents/EmptySearchResult';
import NavigationEmitter from "../../helpers/TabNavigationEvent";
import appConfig from "../../constants/AppConfig";
import ChannelsList from "../ChannelsList";
import DataContract from '../../constants/DataContract';

const tabStyle = NativeBaseTabTheme.tab,
  USER_KIND = DataContract.knownEntityTypes.user,
  TAG_KIND = DataContract.knownEntityTypes.tag,
  VIDEO_KIND = DataContract.knownEntityTypes.video,
  CHANNEL_KIND = DataContract.knownEntityTypes.channel;

const NO_OF_CHARS_TO_RESTRICT_SEARCH = 1;


const TabMap = {
  "top": {
    id: 'top',
    baseUrl: '/search/top',
    title: 'Top',
    "params": {
      "supported_entities": [USER_KIND, TAG_KIND, VIDEO_KIND, CHANNEL_KIND]
    },
    "queryParam": "q",
    "noResultsData": {
      "noResultsMsg": 'No results found.',
      "isEmpty": true
    },
    renderNoResults :  (noResultsData) => {
      const oThis = TabMap.top;
      noResultsData = noResultsData || oThis.noResultsData;
      return <EmptySearchResult  noResultsData={noResultsData}/>
    },
    "sectionsConfig": {
      "videos": {
        "baseUrl": "/tags/52/videos",
        "queryParam": "q"
      }
    },
    extraParams: {
      showBalanceFlyer: true
    },
    supported: true
  },
  "channels": {
    id: CHANNEL_KIND,
    baseUrl : '/search/channels',
    title: 'Communities',
    "queryParam": "q",
    "noResultsData": {
      "noResultsMsg": 'No results found.',
      "isEmpty": true
    },
    renderNoResults:  (noResultsData) => {
      const oThis = TabMap.channels;
      console.log('this.emptyData',oThis.noResultsData);
      noResultsData = noResultsData || oThis.noResultsData;
      return <EmptySearchResult  noResultsData={noResultsData}/>
    },
    filters : [
      {
        text : "Trending",
        id: "trending",
        baseUrl: '/search/channels/trending'
      },
     {
        text : "New",
        id: "new",
        baseUrl: '/search/channels/new'
      },
      {
        text : "Joined",
        id: "joined",
        baseUrl: '/search/channels/my'
      },
      {
        text : "All",
        id: "all",
        baseUrl: '/search/channels/all'
      }
    ],
    supported: true
  },
  "people": {
    id: USER_KIND,
    baseUrl : '/search/users',
    title: 'People',
    "queryParam": "q",
    "noResultsData": {
      "noResultsMsg": 'No results found.',
      "isEmpty": true
    },
    renderNoResults :  (noResultsData) => {
      const oThis = TabMap.people;
      console.log('this.emptyData',oThis.noResultsData);
      noResultsData = noResultsData || oThis.noResultsData;
      return <EmptySearchResult  noResultsData={noResultsData}/>
    },
    supported: true
  },
  "tag": {
    id: TAG_KIND,
    baseUrl : '/search/tags',
    title: 'Tags',
    "queryParam": "q",
    "noResultsData": {
      "noResultsMsg": 'No results found.',
      "isEmpty": true
    },
    renderNoResults:  (noResultsData) => {
      const oThis = TabMap.tag;
      console.log('this.emptyData',oThis.noResultsData);
      noResultsData = noResultsData || oThis.noResultsData;
      return <EmptySearchResult  noResultsData={noResultsData}/>
    },
    supported: true
  },
  "videos": {
    id: VIDEO_KIND,
    baseUrl : '/tags/52/videos',
    title: 'Video',
    "queryParam": "q",
    "getNoResultData": () =>({
      "noResultsMsg": 'No results found.',
      "isEmpty": true
    }),
    extraParams: {
      showBalanceFlyer: true
    },
    renderNoResults :  (noResultsData) => {
      const oThis = TabMap.videos;
      noResultsData = noResultsData || oThis.noResultsData;
      return <EmptySearchResult  noResultsData={noResultsData}/>
    },
    supported: false
  }
};

const TabsArray = [TabMap.top, TabMap.channels, TabMap.people, TabMap.tag, TabMap.videos];

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
      //this.initReferences();
    }
  }

  componentDidMount() {
    NavigationEmitter.on('onRefresh', (screen) => {
      if (screen.screenName == appConfig.tabConfig.tab2.childStack) {
        this.shouldSearch() && this.refreshOnDoubleTab();
      }
    });
  }

  componentWillUnmount() {
    NavigationEmitter.removeListener('onRefresh');
  }

  shouldSearch = () =>{
    return  this.currentSearchTerm.length !== NO_OF_CHARS_TO_RESTRICT_SEARCH;
  };

  refreshOnDoubleTab = () => {
    let tabIndx = this.currentIndex;
    let tabData = TabsArray[ tabIndx];
    let newTabUrl = this.getUrlForTab( tabData );
    let tabFlatList = this.getTabFlatList( tabIndx );
    if(!tabFlatList) return;
    tabFlatList.forcedRefresh(newTabUrl);
    tabFlatList && tabFlatList.scrollToTop();
  };

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
    this.shouldSearch() && this.refreshResults();
  };

  refreshResults = () => {
    let tabIndx = this.currentIndex;
    let tabData = TabsArray[ tabIndx ];
    let currentTabUrl = this.getTabUrlForIndex( tabIndx );
    let newTabUrl = this.getUrlForTab( tabData );

    if ( !currentTabUrl || currentTabUrl !== newTabUrl ) {
      // Force refresh
      let tabFlatList = this.getTabFlatList( tabIndx );
      if(!tabFlatList) return;
      tabFlatList.scrollToTop();
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

  getChannelsTabUrl = ( filter = {}) => {
    const baseUrl = filter.baseUrl; 
    return this.getUrlForTab(TabMap.channels , baseUrl);
  };

  getTagsTabUrl = () => {
    return this.getUrlForTab(TabMap.tag);
  };

  getPeopleTabUrl = () => {
    return this.getUrlForTab(TabMap.people);
  };

  getVideoTabUrl = () => {
    return this.getUrlForTab(TabMap.videos);
  };

  getUrlForTab = (tabData, url) => {
    let baseUrl = url || tabData.baseUrl;

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
  setChannelFlatListRef = (elemRef) => {
    this.flatLists = this.flatLists || {};

    let tabData = TabMap.channels;
    let tabId = tabData.id;
    this.flatLists[ tabId ] = elemRef;

  }

  setPeopleFlatListRef = (elemRef) => {
    this.flatLists = this.flatLists || {};

    let tabData = TabMap.people;
    let tabId = tabData.id;
    this.flatLists[ tabId ] = elemRef;
  };
  setTagsFlatListRef = (elemRef) => {
    this.flatLists = this.flatLists || {};

    let tabData = TabMap.tag;
    let tabId = tabData.id;
    this.flatLists[ tabId ] = elemRef;
  };
  setVideoFlatListRef = (elemRef) => {
    this.flatLists = this.flatLists || {};

    let tabData = TabMap.videos;
    let tabId = tabData.id;
    this.flatLists[ tabId ] = elemRef;
  };

  // endregion

  onChangeTab = (args) => {
    this.currentIndex = args.i;
    this.refreshResults();
  };


  getTopSectionFetchUrl = (kind, extraParams) => {
    let sectionConfig = TabMap.top.sectionsConfig[kind];
    let baseUrl = sectionConfig.baseUrl;
    let params = sectionConfig.params || {};
    extraParams = extraParams || {};
    // Copy it.
    params = Object.assign({}, params, extraParams);
    // Add query string
    params[ sectionConfig.queryParam ] = this.currentSearchTerm;
    // Update when there is a bug.
    return baseUrl + "?" + qs.stringify(params);
  };



  render() {
    if (this.isUserLoggedIn()){
      return this.renderLoggedInView();
    } else {
      this.initReferences();
      return this.renderLoggedOutView()
    }
  }

  renderLoggedOutView = () => {
    return  <React.Fragment />
  };

  renderTabBar = () => {
    const scTabStyle = NativeBaseTabTheme.scrollableTab;
    return (<ScrollableTab
        //  style={{marginHorizontal: 10}}
        tabsContainerStyle={scTabStyle.tabsContainerStyleSkipFont}
        underlineStyle={scTabStyle.underlineStyleSkipFont} />
    );
  };


  showTopTab = () => {
    if (TabMap.top.supported){
      return  <Tab heading={TabMap.top.title} textStyle={tabStyle.textStyle}
                   activeTextStyle={tabStyle.activeTextStyle}
                   activeTabStyle={tabStyle.activeTabStyle}
                   tabStyle={tabStyle.tabStyleSkipFont}
                   style={tabStyle.style}>
        <TopsList
          getFetchUrl={this.getTopTabUrl}
          ref={this.setTopFlatListRef}
          noResultsData={TabMap.top.noResultsData}
          getNoResultsCell={TabMap.top.renderNoResults}
          getSectionFetchUrl={this.getTopSectionFetchUrl}
          navigation={this.props.navigation}
          extraParams={TabMap.top.extraParams}
          supportedEntities={TabMap.top.params.supported_entities}
        />
      </Tab>
    }
    return null;
  };

  showChannelsTab = () => {

    if (TabMap.channels.supported) {
      return <Tab heading={TabMap.channels.title} textStyle={tabStyle.textStyle}
                  activeTextStyle={tabStyle.activeTextStyle}
                  activeTabStyle={tabStyle.activeTabStyle}
                  tabStyle={tabStyle.tabStyleSkipFont}
                  style={tabStyle.style}>
        <ChannelsList
          getFetchUrl={this.getChannelsTabUrl}
          onRef={this.setChannelFlatListRef}
          noResultsData={TabMap.channels.noResultsData}
          getNoResultsCell={TabMap.channels.renderNoResults}
          filters={TabMap.channels.filters}
        />
      </Tab>
    }
    return null;

  };


  showPeopleTab = () => {
    if (TabMap.people.supported) {
      return <Tab heading={TabMap.people.title} textStyle={tabStyle.textStyle}
                  activeTextStyle={tabStyle.activeTextStyle}
                  activeTabStyle={tabStyle.activeTabStyle}
                  tabStyle={tabStyle.tabStyleSkipFont}
                  style={tabStyle.style}>
        <PeopleList
          getFetchUrl={this.getPeopleTabUrl}
          ref={this.setPeopleFlatListRef}
          noResultsData={TabMap.people.noResultsData}
          getNoResultsCell={TabMap.people.renderNoResults}
        />
      </Tab>
    }
    return null;
  };

  showTagsTab = () => {
    if (TabMap.tag.supported) {
      return <Tab heading={TabMap.tag.title} textStyle={tabStyle.textStyle}
                  activeTextStyle={tabStyle.activeTextStyle}
                  activeTabStyle={tabStyle.activeTabStyle}
                  tabStyle={tabStyle.tabStyleSkipFont}
                  style={tabStyle.style}>
        <TagsList
          getFetchUrl={this.getTagsTabUrl}
          ref={this.setTagsFlatListRef}
          noResultsData={TabMap.tag.noResultsData}
          getNoResultsCell={TabMap.tag.renderNoResults}
        />
      </Tab>
    }
    return null;
  };

  showVideoSection = () => {
    if (TabMap.videos.supported) {
      return <Tab heading={TabMap.videos.title} textStyle={tabStyle.textStyle}
           activeTextStyle={tabStyle.activeTextStyle}
           activeTabStyle={tabStyle.activeTabStyle}
           tabStyle={tabStyle.tabStyleSkipFont}
           style={tabStyle.style}>

        <VideoCollections
          onRef={this.setVideoFlatListRef}
          getFetchUrl={this.getVideoTabUrl}
          getNoResultData={TabMap.videos.getNoResultData}
          getNoResultsCell={TabMap.videos.renderNoResults}
          extraParams={TabMap.videos.extraParams}
        />
      </Tab>
    }
    return null;

}

  renderLoggedInView = () => {
    return <SafeAreaView style={styles.container}>
      <SearchListHeader setSearchParams={this.setSearchParams} ref={this.setSearchListHeaderRef} />
      <Tabs renderTabBar={this.renderTabBar}  onChangeTab={this.onChangeTab}>
        {this.showTopTab()}
        {this.showChannelsTab()}
        {this.showPeopleTab()}
        {this.showTagsTab()}
        {this.showVideoSection()}
      </Tabs>
    </SafeAreaView>
  }
}

export default connect(mapStateToProps)(SearchScreen);
