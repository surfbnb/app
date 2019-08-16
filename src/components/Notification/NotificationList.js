import React, { PureComponent } from 'react';
import deepGet from 'lodash/get';
import { connect } from 'react-redux';
import { Text, Dimensions, SectionList, View, ActivityIndicator } from 'react-native';
import { FetchServices } from '../../services/FetchServices';
import EmptyList from '../EmptyFriendsList/EmptyList';
import reduxGetter from '../../services/ReduxGetters';
import CurrentUser from '../../models/CurrentUser';
import Notification from './NotificationItem';
import styles from './styles';


const TODAY = 0,
  YESTERDAY = 1,
  THIS_WEEK = 2,
  THIS_MONTH = 3,
  EARLIER = 4;

class NotificationList extends PureComponent {
  constructor(props) {
    super(props);

    this.fetchService = new FetchServices(`/notifications`);

    this.state = {
      refreshing: false,
      loadingNext: false,
      notificationList: []
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    if (this.state.refreshing) return;
    this.cleanInstanceVariable();
    this.refreshData();
  };

  cleanInstanceVariable() {
    if (this.props.userId) {
      this.fetchService = new FetchServices(`/notifications`);
    }
    this.setState({
      refreshing: false,
      loadingNext: false,
      notificationList: []
    });
  }

  refreshData = () => {
    this.beforeRefresh();
    this.fetchService &&
      this.fetchService
        .refresh()
        .then((res) => {
          this.onRefresh(res);
        })
        .catch((error) => {
          this.onRefreshError(error);
        });
  };

  renderFooter = () => {
    if (!this.state.loadingNext) return null;
    return <ActivityIndicator />;
  };

  beforeRefresh() {
    this.setState({ refreshing: true });
  }

  onRefresh = () => {
    this.setState({ refreshing: false, notificationList: this.createNotificationSections() });
  };

  createNotificationSections = () => {
    let idList = this.fetchService.getIDList();    
    let list = {};
    let outputList = [];
    for (let id of idList) {
      let timeStamp = reduxGetter.getNotificationTimestamp(id);
      let header = this.getHeader(timeStamp);
      if (!list[header.id]) {
        list[header.id] = { title: header.title, data: [id] };
      } else {
        list[header.id].data.push(id);
      }
    }
    for (let i = 0; i < 5; i++) {
        if(list[i]){
            outputList.push(list[i]);
        }
    }    
    return outputList;
  };

  getHeader = (timeStampInMs) => {
    let timeStamp = timeStampInMs / 1000;
    if (Date.now() / 1000 - timeStamp > 30 * 86400) {
      return { title: 'Earlier', id: EARLIER };
    } else if (Date.now() / 1000 - timeStamp > 7 * 86400) {
      return { title: 'This Month', id: THIS_MONTH };
    } else if (Date.now() / 1000 - timeStamp > 86400) {
      return { title: 'This week', id: THIS_WEEK };
    } else {
      return { title: 'Today', id: TODAY };
    }
  };

  onRefreshError = () => {
    this.setState({ refreshing: false });
  };

  getNext = () => {
    console.log('i m here getNext');
    if (this.state.loadingNext || this.state.refreshing || !this.fetchService.hasNextPage) return;
    this.beforeNext();

    this.fetchService
      .fetch()
      .then((res) => {
        this.onGetNext(res);
      })
      .catch((error) => {
        this.onNextError(error);
      });
  };

  beforeNext = () => {
    this.setState({ loadingNext: true });
  };

  onGetNext = () => {
    this.setState({ loadingNext: false, notificationList: this.createNotificationSections() });
  };

  onNextError = () => {
    this.setState({ loadingNext: false });
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
    console.log('item', item);
    return <Notification notificationId={item} />;
  };

  renderSectionHeader = (section) => {
    if (!section.section.title || section.section.data.length == 0) return null;
    return (
      <View style={styles.sectionHeaderView}>
        <Text style={styles.sectionHeaderTitle}>{section.section.title} </Text>
      </View>
    );
  };

  render() {
    console.log(this.state.notificationList, 'this.state.notificationList');
    return (
      <View>
        <SectionList
          ref={(ref)=>{this.sectionListRef= ref}}
          sections={this.state.notificationList}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this._renderItem}
          keyExtractor={(item) => `id_${item}`}
          ListFooterComponent={this.renderFooter}
          refreshing={this.state.refreshing}
          onRefresh={this.refresh}
          stickySectionHeadersEnabled={false}
          onEndReachedThreshold={0.1}          
          onEndReached={this.getNext}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
        />
      </View>
    );
  }
}

export default NotificationList;
