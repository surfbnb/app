import React, { Component } from 'react';
import { FlatList, View, Text, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import styles from './styles';
import User from './User';
import SearchListHeader from './SearchListHeader';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import Colors from '../../theme/styles/Colors';

class SearchResults extends Component {
  constructor(props) {
    super(props);
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return <User userId={item} />;
  };

  getEmptyComponent = () => {
    return (
      !this.props.refreshing &&
      this.props.searchParams &&
      (this.props.noResultsFound && !this.props.toRefresh ? (
        <View>
          <Text style={{ alignSelf: 'center', color: Colors.greyLite, fontSize: 14 }}>No results found!</Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator size="small" color={Colors.greyLite} />
          <Text
            style={{ marginLeft: 20, color: Colors.greyLite, fontSize: 14 }}
          >{`Searching for "${this.props.searchParams}"`}</Text>
        </View>
      ))
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.props.list}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps={'always'}
          horizontal={this.props.horizontal}
          enableEmptySections={true}
          stickyHeaderIndices={[0]}
          onEndReached={this.props.getNext}
          keyExtractor={this._keyExtractor}
          refreshing={false}
          onEndReachedThreshold={5}
          renderItem={this._renderItem}
          ListEmptyComponent={this.getEmptyComponent}
          ListHeaderComponent={<SearchListHeader setSearchParams={this.props.setSearchParams} />}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }
}

export default flatlistHOC(SearchResults, {
  keyPath: 'payload.user_id',
  silentRefresh: true
});
