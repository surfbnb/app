import React, { Component } from 'react';
import { View, Keyboard, FlatList, Text } from 'react-native';

import flatlistHOC from '../CommonComponents/flatlistHOC';
import styles from './styles';
import Colors from '../../theme/styles/Colors';
import UserRow from '../CommonComponents/UserRow';
import InviteUser from '../CommonComponents/UserRow/Invite';

class InvitesList extends Component {
  constructor(props) {
    super(props);
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return  <UserRow userId={item} ><InviteUser  userId={item} /></UserRow>;
  };

  getEmptyComponent = () => {
    if (this.props.noResultsFound) {
      return this.renderNoResults();
    }
    return null;
  };

  renderNoResults() {
    return (
      <View style={{ marginTop: 30 }}>
        <Text style={{ textAlign: 'center', color: Colors.darkGray }}>No Invitees!</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.listWrapper}>
        <FlatList
          data={this.props.list}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps={'always'}
          onEndReached={this.props.getNext}
          keyExtractor={this._keyExtractor}
          refreshing={false}
          onEndReachedThreshold={5}
          renderItem={this._renderItem}
          ListEmptyComponent={this.getEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

export default flatlistHOC(InvitesList, {
  keyPath: 'payload.user_id',
  silentRefresh: true
});
