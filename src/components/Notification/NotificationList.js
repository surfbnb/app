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
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    let timeStamp = reduxGetter.getNotificationTimestamp(item);
    this.newHeader = this.getHeader(timeStamp);
    let header = this.newHeader != this.lastHeader ? this.newHeader : '';
    this.lastHeader = this.newHeader;
    return <Notification notificationId={item} header={header} />;
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.list != this.props.list) {
      this.lastHeader = null;
      this.newHeader = null;
    }
  }

  getHeader = (timeStamp) => {
    console.log(Date.now() / 1000 - timeStamp);
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

  render() {
    return (
      <View>
        <FlatList
          data={this.props.list}
          onEndReached={this.props.getNext}
          onRefresh={this.props.refresh}
          keyExtractor={this._keyExtractor}
          refreshing={this.props.refreshing}
          onEndReachedThreshold={5}
          ListFooterComponent={this.props.renderFooter}
          renderItem={this._renderItem}
        />
        {this.props.list && this.props.list.length == 0 && !this.props.refreshing && (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: Colors.whiteSmoke }}
          >
            <EmptyList displayText="Currently you do not have any notification." />
          </View>
        )}
      </View>
    );
  }
}

export default flatlistHOC(NotificationList);
