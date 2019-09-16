import React, { Component } from 'react';
import { View, Keyboard, FlatList, Text } from 'react-native';

import User from './User';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import styles from './styles';
import Colors from '../../theme/styles/Colors';

class InvitesList extends Component {
  constructor(props) {
    super(props);
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return <User userId={item} />;
  };

  getEmptyComponent = () => {
    if (this.props.noResultsFound) {
      return this.renderNoResults();
    }
    return null;
  };

  renderNoResults() {
    return (
      <View>
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
