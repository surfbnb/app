import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import User from './User';
import flatlistHOC from "../CommonComponents/flatlistHOC";

class UserList  extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.list}
          onEndReached={() => this.props.getNext()}
          onRefresh={() => this.props.refresh()}
          keyExtractor={(item, index) => `id_${item}`}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
          refreshing={this.props.refreshing}
          ListFooterComponent={this.props.renderFooter}
          renderItem={({ item }) => {
            return <User id={item} />;
          }}
        />
      </View>
    );
  }
}

export default flatlistHOC( UserList );
