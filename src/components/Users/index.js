import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

import styles from './styles';

class Users extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getUsersData();
  }

  getUsersData = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData, 'users data');

        this.props.dispatchUpsert(responseData);
      })
      .catch(console.warn)
      .done();
  };

  render() {
    return (
      <View>
        <FlatList data={this.props.users} renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>} />
      </View>
    );
  }
}

export default Users;
