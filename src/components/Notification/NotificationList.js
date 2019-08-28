import React, { PureComponent } from 'react';
import { Text, SectionList, View, ActivityIndicator } from 'react-native';
import EmptyList from '../EmptyFriendsList/EmptyList';
import reduxGetter from '../../services/ReduxGetters';
import Notification from './NotificationItem';
import styles from './styles';
import flatlistHOC from '../CommonComponents/flatlistHOC';

const TODAY = 0,
  THIS_WEEK = 2,
  THIS_MONTH = 3,
  EARLIER = 4;

class NotificationList extends PureComponent {
  constructor(props) {
    super(props);
    this.sectionListRef = null;
  }

  createNotificationSections = () => {
    let idList = this.props.list;
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
      if (list[i]) {
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
    } else if (Date.now() / 1000 - timeStamp >= 79200) {
      return { title: 'This week', id: THIS_WEEK };
    } else {
      return { title: 'Today', id: TODAY };
    }
  };

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return <Notification notificationId={item} />;
  };

  renderSectionHeader = (section) => {
    if (!section.section.title || section.section.data.length === 0) return null;
    return (
      <View style={styles.sectionHeaderView}>
        <Text style={styles.sectionHeaderTitle}>{section.section.title} </Text>
      </View>
    );
  };

  emptyList = () => {
    return !this.props.refreshing && <EmptyList displayText={'You currently do not have any activities.'}></EmptyList>;
  };

  getSection() {
    return this.createNotificationSections();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SectionList
          ref={(ref) => {
            this.sectionListRef = ref;
          }}
          sections={this.getSection()}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this._renderItem}
          keyExtractor={(item) => `id_${item}`}
          ListFooterComponent={this.props.renderFooter}
          refreshing={this.props.refreshing}
          onRefresh={this.props.refresh}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={this.emptyList}
          onEndReachedThreshold={0.1}
          onEndReached={this.props.getNext}
        />
      </View>
    );
  }
}

export default flatlistHOC(NotificationList);
