import React, { PureComponent } from 'react';
import { FlatList, View, Text } from 'react-native';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import reduxGetter from '../../services/ReduxGetters';
import Colors from '../../theme/styles/Colors';
import Notification from './NotificationItem';

import EmptyList from '../EmptyFriendsList/EmptyList';

class NotificationList extends PureComponent {
  constructor(props) {
    super(props);
    this.lastHeader = null;
    this.newHeader = null;
    this.flatlistRef = null;
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    let timeStamp = reduxGetter.getNotificationTimestamp(item);
    this.newHeader = this.getHeader(timeStamp);
    let header = this.newHeader != this.lastHeader || index == 0 ? this.newHeader : '';
    this.lastHeader = this.newHeader;
    return <Notification notificationId={item} header={header} />;
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.list != this.props.list) {
      this.lastHeader = null;
      this.newHeader = null;
    }
  }

  getHeader = (timeStampInMs) => {
    let timeStamp = timeStampInMs / 1000;    
    if (Date.now() / 1000 - timeStamp > 30 * 86400) {
      return 'Earlier';
    } else if (Date.now() / 1000 - timeStamp > 7 * 86400) {
      return 'This Month';
    } else if (Date.now() / 1000 - timeStamp > 86400) {
      return 'This week';
    } else {
      return 'Today';
    }
  };

  getEmptyComponent = () => {
    return !this.props.refreshing && <EmptyList displayText="Currently you don't have any activities." />;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          ref={(ref)=> {this.flatlistRef = ref}}
          data={this.props.list}
          onEndReached={this.props.getNext}
          onRefresh={this.props.refresh}
          keyExtractor={this._keyExtractor}
          refreshing={this.props.refreshing}
          onEndReachedThreshold={5}
          ListEmptyComponent={this.getEmptyComponent}
          ListFooterComponent={this.props.renderFooter}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

export default flatlistHOC(NotificationList);
