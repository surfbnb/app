import React, { Component } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import FeedRow from '../FeedComponents/FeedRow';
import { FetchServices } from '../../services/FetchServices';

class FeedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds: [],
      refreshing: false,
      loadingNext: false
    };
    if (this.props.fetchUrl) {
      this.fetchServices = new FetchServices(this.props.fetchUrl);
    }
  }

  componentDidMount() {
    if (!this.fetchServices) return;
    this.initList();
  }

  componentDidUpdate(){
    if( this.props.toRefresh ){
      this.refresh();
    }
  }

  initList() {
    this.refresh();
  }

  refresh() {
    if (this.state.refreshing) return;
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
    this.props.beforeRefresh && this.props.beforeRefresh();
    this.setState({ refreshing: true });
  }

  onRefresh(res) {
    this.props.onRefresh && this.props.onRefresh(res);
    this.setState({ refreshing: false, feeds: this.fetchServices.getIDList() }); 
  }

  onRefreshError(error) {
    this.props.onRefreshError && this.props.onRefreshError(error);
    this.setState({ refreshing: false , feeds: this.fetchServices.getIDList() });
  }

  getNext = () => {
    if (this.state.loadingNext || this.state.refreshing) return;
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

  beforeNext() {
    this.props.beforeNext && this.props.beforeNext();
    this.setState({ loadingNext: true });
  }

  onNext(res) {
    this.props.onNext && this.props.onNext(res);
    this.setState({ loadingNext: false , feeds: this.fetchServices.getIDList()  });
  }

  onNextError(error) {
    this.props.onNextError && this.props.onNextError(error);
    this.setState({ loadingNext: false , feeds: this.fetchServices.getIDList() });
  }

  renderFooter = () => {
    if (!this.state.loadingNext) return null;
    return <ActivityIndicator />;
  };

  render() {
    return (
      <FlatList
        style={[this.props.style]}
        data={this.state.feeds}
        onEndReached={() => this.getNext()}
        onRefresh={() => this.refresh()}
        keyExtractor={(item, index) => `id_${item}`}
        onEndReachedThreshold={0.5}
        initialNumToRender={20}
        refreshing={this.state.refreshing}
        ListHeaderComponent={this.props.ListHeaderComponent ? this.props.ListHeaderComponent : <View></View>}
        ListFooterComponent={this.renderFooter}
        renderItem={({ item }) => <FeedRow id={item} nestedNavigation={this.props.nestedNavigation ? true : false} />}
      />
    );
  }
}

export default FeedList;
