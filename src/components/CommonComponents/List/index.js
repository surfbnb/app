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
    this.props.beforeRefresh && this.props.beforeRefresh();
    this.setState({ refreshing: true });
  }

  onRefresh(res) {
    this.props.onRefresh && this.props.onRefresh(res);
    this.setState({ refreshing: false, list: this.fetchServices.getIDList() });
  }

  onRefreshError(error) {
    this.props.onRefreshError && this.props.onRefreshError(error);
    this.setState({ refreshing: false, list: this.fetchServices.getIDList() });
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
    this.setState({ loadingNext: false, list: this.fetchServices.getIDList() });
  }

  onNextError(error) {
    this.props.onNextError && this.props.onNextError(error);
    this.setState({ loadingNext: false, list: this.fetchServices.getIDList() });
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
