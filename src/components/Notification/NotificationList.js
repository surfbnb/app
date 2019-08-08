import React, { PureComponent } from 'react';
import { FlatList, View, Text } from 'react-native';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import User from '../Users/User';
import Colors from '../../theme/styles/Colors';
import Notification from './NotificationItem';

import EmptyList from '../EmptyFriendsList/EmptyList';

class NotificationList extends PureComponent {
  constructor(props) {
    super(props);
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    
    return <Notification notificationId={item} /> 
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
            <EmptyList displayText="You are currently not supporting to anyone" />
          </View>
        )}
      </View>
    );
  }
}

export default flatlistHOC(NotificationList);
