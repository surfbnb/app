import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from './styles';
import LogoutComponent from '../LogoutLink';

class Profile extends Component {
  static navigationOptions = (options) => {
    return {
      headerTitle: 'Profile',
      headerRight: <LogoutComponent {...options} />
    };
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.link}>Profile</Text>
      </View>
    );
  }
}

export default Profile;
