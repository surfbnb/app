import React, { Component } from 'react';
import deepGet from 'lodash/get';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import { Text, Dimensions, SectionList, View } from 'react-native';
import { FetchServices } from '../../services/FetchServices';
import EmptyList from '../EmptyFriendsList/EmptyList';
import User from '../Users/User';
const SUPPORTING = 'SUPPORTING';
const SUGGESTIONS = 'SUGGESTIONS';
const scrollDetectNext = true;
const GET_SUPPORTING_URL = '/users/contribution-to';
const GET_SUGGESTIONS_URL = '/users/contribution-suggestion';

class SupportingList extends Component {
  constructor(props) {
    super(props);
    this.fetchServiceSupporting = new FetchServices(GET_SUPPORTING_URL);
    this.fetchServiceSuggestions = new FetchServices(GET_SUGGESTIONS_URL);

    this.state = {
      refreshing: false,
      loadingNextSuggestions: false,
      loadingNextSupporting: false,
      supportingList: [],
      suggestionsList: []
    };
    this.currentFetching = SUPPORTING;
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    if (this.state.refreshing) return;
    this.cleanInstanceVariable();
    this.refreshSupportingData();
  };

  cleanInstanceVariable() {
    this.fetchServiceSupporting = new FetchServices(GET_SUPPORTING_URL);
    this.fetchServiceSuggestions = new FetchServices(GET_SUGGESTIONS_URL);
    this.currentFetching = SUPPORTING;
    this.setState({
      loadingNextSuggestions: false,
      loadingNextSupporting: false,
      refreshing: false
    });
  }

  refreshSupportingData = () => {
    this.beforeRefreshSupportings();
    this.fetchServiceSupporting
      .refresh()
      .then((res) => {
        this.onRefreshSupportings(res);
      })
      .catch((error) => {
        this.onRefreshSupportingError(error);
      });
  };

  beforeRefreshSupportings() {
    this.setState({ refreshing: true });
  }

  onRefreshSupportings = () => {
    if (!this.fetchServiceSupporting.hasNextPage) {
      this.currentFetching = SUGGESTIONS;
      this.getSuggestionsData();
    }
    this.setState({ refreshing: false, supportingList: this.fetchServiceSupporting.getIDList() });
  };

  onRefreshSupportingError = () => {
    this.setState({ refreshing: false });
  };

  getSuggestionsData = () => {
    this.beforeRefreshSuggestions();
    this.fetchServiceSuggestions
      .refresh()
      .then((res) => {
        this.onRefreshSuggestions(res);
      })
      .catch((error) => {
        this.onRefreshSuggestionsError(error);
      });
  };

  beforeRefreshSuggestions = () => {
    this.setState({ refreshing: true });
  };

  onRefreshSuggestions = () => {
    this.setState({ refreshing: false, suggestionsList: this.fetchServiceSuggestions.getIDList() });
  };

  onRefreshSuggestionsError = () => {
    this.setState({ refreshing: false });
  };

  getNextSupporting = () => {
    console.log('getNextSupporting');
    if (this.state.loadingNextSupporting || this.state.refreshing || !this.fetchServiceSupporting.hasNextPage) return;
    console.log('getNextSupporting here');
    this.beforeNextSupporting();

    this.fetchServiceSupporting
      .fetch()
      .then((res) => {
        this.onGetNextSupporting(res);
      })
      .catch((error) => {
        this.onNextErrorSupporting(error);
      });
  };

  beforeNextSupporting = () => {
    this.setState({ loadingNextSupporting: true });
  };

  onGetNextSupporting = () => {
    if (!this.fetchServiceSupporting.hasNextPage) {
      this.currentFetching = SUGGESTIONS;
    }
    this.setState({ loadingNextSupporting: false, supportingList: this.fetchServiceSupporting.getIDList() });
  };

  onNextErrorSupporting = () => {
    this.setState({ loadingNextSupporting: false });
  };

  getNextSuggestions = () => {
    if (this.state.loadingNextSuggestions || this.state.refreshing || !this.fetchServiceSuggestions.hasNextPage) return;

    this.beforeNextSuggestions();
    this.fetchServiceSuggestions
      .fetch()
      .then((res) => {
        this.onGetNextSuggestions(res);
      })
      .catch((error) => {
        this.onNextErrorSuggestions(error);
      });
  };

  beforeNextSuggestions = () => {
    this.setState({ loadingNextSuggestions: true });
  };

  onGetNextSuggestions = () => {
    this.setState({ loadingNextSuggestions: false, suggestionsList: this.fetchServiceSuggestions.getIDList() });
  };

  onNextErrorSuggestions = () => {
    this.setState({ loadingNextSuggestions: false });
  };

  getNext = () => {
    console.log('getNext', this.currentFetching);
    if (this.currentFetching == SUPPORTING) {
      this.getNextSupporting();
    } else if (this.currentFetching == SUGGESTIONS) {
      this.getNextSuggestions();
    }
  };

  onRefreshError(error) {
    console.log('on refresh error.........', error);
    this.props.onRefreshError && this.props.onRefreshError(error);
    this.setState({ refreshing: false });
  }

  onViewableItemsChanged(data) {
    currentIndex = deepGet(data, 'viewableItems[0].index');
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return <User id={item} />;
  };

  getDataSource() {
    let dataSource = [
      {
        title: null,
        key: SUPPORTING,
        data:  this.state.supportingList
      }
    ];
    if (this.currentFetching == SUGGESTIONS) {
      dataSource.push({
        title: 'Suggestions',
        key: SUGGESTIONS,
        data: this.state.suggestionsList
      });
    }
    return dataSource;
  }

  renderNoContent = (section) => {
    console.log(section, section.key, section.key == SUGGESTIONS,  'section section');
    let displayText = '';
    if(section.key == SUPPORTING){
      displayText = 'You are currently not supporting anyone'
    } else if (section.key == SUGGESTIONS){
      displayText = 'You are currently do not have any suggestions'
      return null;
      
    }
    if (section.data.length == 0) {
      return <EmptyList displayText={displayText} />
    }
    return null;
  };

  renderSectionHeader = (section) => {
    if (!section.section.title || (section.section.data.length == 0 )) return null;
    return (
      <View style={{padding: 12}}>
        <Text> {section.section.title} </Text>
      </View>
    );
  };

  render() {
    console.log(this.getDataSource(), 'getDataSource');
    return (
      <SectionList
        //style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
        sections={this.getDataSource()}
        renderSectionFooter={({ section }) => this.renderNoContent(section)}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this._renderItem}
        keyExtractor={(item) => `id_${item}`}
        refreshing={this.state.refreshing}
        onRefresh={this.refresh}
        stickySectionHeadersEnabled={false}
        onEndReachedThreshold={0.1}
        // onScroll={this.getNext}
        onEndReached={this.getNext}
        onMomentumScrollBegin={() => {
          this.onEndReachedCalledDuringMomentum = false;
        }}
      />
    );
  }
}

export default SupportingList;
