import React, { Component } from 'react';
import { View  } from 'react-native';
import ProfileScreen from "./ProfileScreen";

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
        <ProfileScreen></ProfileScreen>
      </View>
    );
  }
}

export default Profile;
