import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

import { styles } from './styles';
import LogoutComponent from './../LogoutLink';

class Users extends Component {
  static navigationOptions = {
    headerTitle: 'Users',
    headerRight: <LogoutComponent />
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Inside Users</Text>
      </View>
    );
  }
}

export default Users;
