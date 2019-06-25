import React, { Component } from 'react';
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
    this.props.navigation.tab = "Users"; 
  }

  render() {
    return <UserList fetchUrl="/users" navigate={this.props.navigation.navigate} />;
  }
}

export default Users;
