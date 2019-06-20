import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { FetchServices } from '../../../services/FetchServices';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
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
    this.setState({ refreshing: true });
    this.props.beforeRefresh && this.props.beforeRefresh();
  }

  onRefresh(res) {
    this.setState({ refreshing: false, list: this.fetchServices.getIDList() });
    this.props.onRefresh && this.props.onRefresh(res);
  }

  onRefreshError(error) {
    this.setState({ refreshing: false , list: this.fetchServices.getIDList()});
    this.props.onRefreshError && this.props.onRefreshError(error);
  }

  getNext = () => {
    if (this.state.loadingNext || this.state.refreshing) return;

    console.log('fetching exce');
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
    this.setState({ loadingNext: true });
    this.props.beforeNext && this.props.beforeNext();
  }

  onNext(res) {
    this.setState({ loadingNext: false, list: this.fetchServices.getIDList() });
    this.props.onNext && this.props.onNext(res);
  }

  onNextError(error) {
    console.log('fetching error');
    this.setState({ loadingNext: false, list: this.fetchServices.getIDList() });
    this.props.onNextError && this.props.onNextError(error);
  }

  renderFooter = () => {
    if (!this.state.loadingNext) return null;
    return <ActivityIndicator />;
  };

  render() {
    return (
      <View>
        <Text>Overwrite from base component</Text>
      </View>
    );
  }
}

export default List;
