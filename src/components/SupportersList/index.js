import React, { PureComponent } from 'react';
import { FlatList, Dimensions, View } from 'react-native';
import deepGet from 'lodash/get';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import User from '../Users/User';
import EmptyList from '../EmptyFriendsList/EmptyList';
import Colors from '../../theme/styles/Colors';

class SupportersList extends PureComponent {
  constructor(props) {
    super(props);
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return <User id={item} />;
  };

  render() {
    return (
      <View style={this.props.list.length > 0 ? { flex: 1, height: Dimensions.get('window').height - 130 } : {}}>
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
            <EmptyList displayText="You are currently do not have any supporters" />
          </View>
        )}
      </View>
    );
  }
}

export default flatlistHOC(SupportersList);
