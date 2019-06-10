import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';

const userStatus = {
  activated: 'activated'
};

export default class AuthLoading extends Component {
  constructor() {
    super();
    this.init();
  }

  // Fetch the token from storage then navigate to our appropriate place
  init = async () => {
    const user = await AsyncStorage.getItem('user');

    // This will switch to the Home screen or SetPinScreen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    const status = (user && user['status']) || '';
    if (!user) {
      this.props.navigation.navigate('AuthScreen');
    } else if (status.toLowerCase() == userStatus.activated) {
      this.props.navigation.navigate('SetPinScreen');
    } else {
      this.props.navigation.navigate('HomeScreen');
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
