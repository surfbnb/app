import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './styles';
import UserList from './UserList';

class Users extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Friends',
      headerBackTitle: null
    };
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <UserList fetchUrl="/users" navigate={this.props.navigation.navigate} />
        <View style={{ height: 78 }}></View>
      </View>
    );
  }
}

export default Users;
