import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import deepGet from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import styles from './styles';

//TODO move to constants
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
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user) || {};

    // This will switch to the Home screen or SetPinScreen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    const status = deepGet(user, 'user_details.ost_status') || '';
    if (!isEmpty(user) && status.toLowerCase() !== userStatus.activated) {
      this.props.navigation.navigate('SetPinScreen');
    } else if (!isEmpty(user)) {
      this.props.navigation.navigate('HomeScreen');
    } else {
      this.props.navigation.navigate('AuthScreen');
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
