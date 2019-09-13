import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar, Alert } from 'react-native';

import Toast from '../../theme/components/NotificationToast';
import reduxGetter from '../../services/ReduxGetters';
import styles from './styles';
import CurrentUser from '../../models/CurrentUser';
import { OstWalletSdk, OstWalletSdkUI } from '@ostdotcom/ost-wallet-sdk-react-native';
import { PLATFORM_API_ENDPOINT } from '../../constants';
import { ostErrors } from '../../services/OstErrors';
import { LoadingModal } from '../../theme/components/LoadingModalCover';
import ost_sdk_theme_config from '../../theme/ostsdk/ost-sdk-theme-config';
import ost_sdk_content_config from '../../theme/ostsdk/ost-sdk-content-config';

let t1, t2;

export default class AuthLoading extends Component {
  constructor() {
    super();
    this.init();
  }

  // Fetch the token from storage then navigate to our appropriate place
  init = async () => {
    LoadingModal.show('Syncing...');
    t1 = Date.now();
    OstWalletSdkUI.setThemeConfig(ost_sdk_theme_config);
    OstWalletSdkUI.setContentConfig(ost_sdk_content_config);
    OstWalletSdk.initialize(PLATFORM_API_ENDPOINT, this.onSdkInitialized);
  };

  onSdkInitialized = (error, success) => {
    if (error) {
      Toast.show({
        text: 'Ost Sdk Initialization failed, Please restart your app.',
        icon: 'error'
      });
    }

    t2 = Date.now();
    console.log(`OstWalletSdk.initialize took: ${t2 - t1} ms`);

    CurrentUser.initialize()
      .then((user) => {
        LoadingModal.hide();
        if (user && !CurrentUser.isActiveUser(user)) {
          this.props.navigation.navigate('UserActivatingScreen');
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
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
