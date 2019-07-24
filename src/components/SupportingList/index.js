import React, { Component } from 'react';
import deepGet from 'lodash/get';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import { Text, Dimensions, SectionList } from 'react-native';
import { FetchServices } from '../../services/FetchServices';
import User from '../Users/User';

let currentIndex = 0;

const SUPPORTING = 'SUPPORTING';
const SUGGESTIONS = 'SUPPORTING';
const scrollDetectNext = true;

class SupportingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loadingNext: false,
      activeIndex: 0,
      supportingList: [],
      suggestionsList: [],
      currentFetch: SUPPORTING
    };
  }
  componentDidMount() {
    if (this.props.fetchUrl) {
      this.initList(new FetchServices(this.props.fetchUrl));
    }
  }

  initList(fetchServices) {
    this.refresh(fetchServices);
  }

  refresh(fetchServices) {
    if (this.state.refreshing) return;
    if (fetchServices) {
      this.fetchServices = fetchServices;
    } else {
      this.fetchServices = this.fetchServices.clone();
    }
    this.beforeRefresh();
    this.fetchServices
      .refresh()
      .then((res) => {
        this.onRefresh(res);
      })
      .catch((error) => {
        this.onRefreshError(error);
      });
  }

  beforeRefresh() {
    console.log('beforeRefresh .........');
    this.props.beforeRefresh && this.props.beforeRefresh();
    this.setState({ refreshing: true });
  }

  onRefresh(res) {
    console.log('on refresh .........', res, this.fetchServices.getIDList());
    this.props.onRefresh && this.props.onRefresh(res);
    this.setState({
      refreshing: false,
      supportingList: [
        ...this.state.supportingList,
        ...this.fetchServices.getIDList()        
      ]
    });
  }

  onNext(res) {
    console.log('on next .........');
    this.props.onNext && this.props.onNext(res);
    let updatedStateObj = {};
    updatedStateObj.loadingNext = false;
    if (this.state.currentFetch == SUPPORTING) {
      updatedStateObj['supportingList'] = [
        ...this.state.supportingList,
        ...this.fetchServices.getIDList()        
      ];
    } else if (this.state.currentFetch == SUGGESTIONS) {
      updatedStateObj['suggestionsList'] = [...this.state.suggestionsList, ...this.fetchServices.getIDList()];
    }
    this.setState(updatedStateObj);
  }

  onRefreshError(error) {
    console.log('on refresh error.........', error);
    this.props.onRefreshError && this.props.onRefreshError(error);
    this.setState({ refreshing: false });
  }

  onViewableItemsChanged(data) {
    currentIndex = deepGet(data, 'viewableItems[0].index');
  }

  setActiveIndex() {
    if (this.state.activeIndex == currentIndex) return;
    this.setState({ activeIndex: currentIndex });
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return <User id={item} />;
  };

  beforeNext() {
    console.log('next .........');
    if (scrollDetectNext) {
      this.onEndReachedCalledDuringMomentum = true;
    }
    this.props.beforeNext && this.props.beforeNext();
    this.setState({ loadingNext: true });
  }

  getNext = () => {
    console.log(this.fetchServices.hasNextPage, 'this.fetchServices.hasNextPage');
    console.log(this.state.currentFetch, 'this.state.currentFetch');
    console.log(this.state.refreshing, 'this.state.refreshing');
    console.log(this.state.loadingNext, 'this.state.loadingNext');

    if (this.state.loadingNext || this.state.refreshing) return;
    if (!this.fetchServices.hasNextPage && this.state.currentFetch == SUGGESTIONS) return;
    if (!this.fetchServices.hasNextPage && this.state.currentFetch == SUPPORTING) {
      this.fetchServices = new FetchServices('/users/contribution-by');
      this.setState({
        currentFetch: SUGGESTIONS
      });
    }
    this.beforeNext();
    this.fetchServices
      .fetch()
      .then((res) => {
        this.onNext(res);
      })
      .catch((error) => {
        this.onNextError(error);
      });
  };

  getDataSource() {
    let dataSource = [
      {
        title: 'Supporting',
        data: this.state.supportingList
      }
    ];
    if (this.state.currentFetch == SUGGESTIONS) {
      dataSource.push({
        title: 'Suggestions',
        data: this.state.suggestionsList
      });
    }
    return dataSource;
  }

  render() {
    return (
      <SectionList
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
        sections={this.getDataSource()}
        ListEmptyComponent={<Text> Hey I am empty </Text>}
        renderSectionHeader={this._renderSectionHeader}
        renderItem={this._renderItem}
        keyExtractor={(item) => item}
        refreshing={this.state.refreshing}
        // onEndReachedThreshold={0.9}
        onEndReached={this.getNext}
      />
    );
  }
}

export default SupportingList;
