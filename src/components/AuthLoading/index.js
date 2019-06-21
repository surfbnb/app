import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar, Alert } from 'react-native';
import styles from './styles';
import currentUserModal from '../../models/CurrentUser';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { PLATFROM_API_ENDPOINT } from '../../constants';
import { ostErrors } from '../../services/OstErrors';

let t1, t2;

export default class AuthLoading extends Component {
  constructor() {
    super();
    this.init();
  }

  // Fetch the token from storage then navigate to our appropriate place
  init = async () => {
    t1 = Date.now();
    OstWalletSdk.initialize(PLATFROM_API_ENDPOINT, this.onSdkInitialized);
  };

  onSdkInitialized = (error, success) => {
    t2 = Date.now();
    console.log(`OstWalletSdk.initialize took: ${t2 - t1} ms`);
    currentUserModal
      .initialize()
      .then((user) => {
        if (!user) {
          this.props.navigation.navigate('AuthScreen');
          return;
        }
        if (!currentUserModal.isActiveUser(user)) {
          this.props.navigation.navigate('SetPinScreen');
        } else {
          this.props.navigation.navigate('HomeScreen');
        }
      })
      .catch(() => {
        Alert.alert('', ostErrors.getUIErrorMessage('general_error'));
      });
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
