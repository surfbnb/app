import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

import PepoApi from '../../services/PepoApi';
import User from './User';
import styles from './styles';

class Users extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getUsersData();
  }

  getUsersData = () => {
    // new PepoApi('/users', {
    //   method: 'GET',
    //   credentials: 'include'
    // })
    //   .fetch(this.props.navigation.navigate)
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
      <View style={styles.container}>
        <FlatList
          data={this.props.users}
          keyExtractor={(item, index) => String(item.id)}
          renderItem={({ item }) => <User id={item.id} user={item} />}
        />
      </View>
    );
  }
}

export default Users;
