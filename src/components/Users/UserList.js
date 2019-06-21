import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import User from './User';
import List from '../CommonComponents/List';
class UserList extends List {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.state.list && this.state.list.length > 0) {
      return (
        <FlatList
          data={this.state.list}
          onEndReached={() => {
            setTimeout(() => {
              this.getNext();
            }, 100);
          }}
          onRefresh={() => {
            this.refresh();
          }}
          removeClippedSubviews={false}
          keyExtractor={(item, index) => `id_${item}`}
          onEndReachedThreshold={0.8}
          refreshing={this.state.refreshing}
          ListFooterComponent={this.renderFooter}
          renderItem={({ item }) => {
            return <User id={item} navigate={this.props.navigate} />;
          }}
        />
      );
    }
    return <View></View>;
  }
}

export default UserList;
