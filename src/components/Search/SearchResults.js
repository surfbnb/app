import React, { Component, PureComponent } from 'react';
import { FlatList, View, Text, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import styles from './styles';
import User from './User';
import SearchListHeader from './SearchListHeader';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import Colors from '../../theme/styles/Colors';

class SearchResults extends PureComponent {
  constructor(props) {
    super(props);
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
     return <User userId={item} />;
  };

  getEmptyComponent = () => {
    if (!this.props.refreshing && this.props.searchParams) {
      if (this.props.noResultsFound && !this.props.toRefresh) {
        return this.renderNoResults();
      }
    }

    if (this.shouldMakeApiCall() && this.props.searchParams) {
      return this.renderSearchingFor();
    }

    if(!this.props.searchParams){
      return ( <View style={{ flex: 1,flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                <ActivityIndicator style={{alignSelf:'center'}} size="small" color={Colors.greyLite} />
              </View>);
    }

    return null;
  };

  shouldMakeApiCall() {
    if (this.props.shouldMakeApiCall) {
      return this.props.shouldMakeApiCall();
    }
    return true; // Default behaviour.
  }

  renderNoResults() {
    return (
      <View>
        <Text style={{ alignSelf: 'center', color: Colors.greyLite, fontSize: 14, marginTop: 10 }}>
          No results found!
        </Text>
      </View>
    );
  }

  renderSearchingFor() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <ActivityIndicator size="small" color={Colors.greyLite} />
        <Text style={{ marginLeft: 20, color: Colors.greyLite, fontSize: 14 }}>
          {`Searching for "${decodeURIComponent(this.props.searchParams) || ''}"`}
        </Text>
      </View>
    );
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>        
        <FlatList
          data={this.props.list}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps={'handled'}          
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
