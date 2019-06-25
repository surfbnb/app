import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import User from './User';
import List from '../CommonComponents/List';
class UserList extends List {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.list}
          onEndReached={() => this.getNext()}
          onRefresh={() => this.refresh()}
          keyExtractor={(item, index) => `id_${item}`}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
          refreshing={this.state.refreshing}
          ListFooterComponent={this.renderFooter}
          renderItem={({ item }) => {
            return <User id={item} />;
          }}
        />
      </View>
    );
  }
}

export default UserList;
