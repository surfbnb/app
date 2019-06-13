import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

import PepoApi from '../../services/PepoApi';
import User from './User';
import styles from './styles';
import deepGet from 'lodash/get';
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';

class Users extends Component {
  constructor(props) {
    super(props);
    this.nextPagePayload = {};
    this.isFetching = false;
  }

  componentDidMount() {
    this.getUsersData();
  }

  getUsersData = () => {
    // bail out if...
    // 1. A request is already sent
    // 2.There is no next page
    // 3.The last page payload is same as next page payload
    if (this.isFetching || this.nextPagePayload === null) return;
    if (this.lastPagePayload && this.lastPagePayload === JSON.stringify(this.nextPagePayload)) return;

    this.isFetching = true;

    // copy this.nextPagePayload -> this.lastPagePayload
    this.lastPagePayload = JSON.stringify(this.nextPagePayload);

    new PepoApi('/users')
      .setNavigate(this.props.navigation.navigate)
      .get(this.nextPagePayload)
      .then((responseData) => {
        if (responseData && responseData.data) {
          this.nextPagePayload = deepGet(responseData, 'data.meta.next_page_payload');
        }
      })
      .catch(console.warn)
      .done(() => {
        this.isFetching = false;
      });
  };

  userClick(item) {
    let headerText = 'Transaction';
    if (item) {
      headerText = item.first_name + item.last_name;
    }
    this.props.navigation.navigate('TransactionScreen', { transactionHeader: headerText });
  }

  render() {
    if (this.props.user_list.length > 0) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.props.user_list}
            onEndReached={this.getUsersData}
            keyExtractor={(item, index) => `id_${item}`}
            onEndReachedThreshold={0.2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  this.userClick(this.props.user_entities[`id_${item}`]);
                }}
              >
                <User id={item} user={this.props.user_entities[`id_${item}`]} />
              </TouchableOpacity>
            )}
          />

          <View style={{ height: 78 }}></View>
        </View>
      );
    }
    return <View></View>;
  }
}

export default Users;
