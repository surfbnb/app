import React, { Component } from 'react';
import { OstWalletSdkEvents } from '@ostdotcom/ost-wallet-sdk-react-native';

import RootNavigationContainer from './RootNavigationContainer';
import Store from './src/store';
import { Provider } from 'react-redux';

export default class AppContainer extends Component {
  componentDidMount() {
    OstWalletSdkEvents.subscribeEvent();
  }

  componentWillUnmount() {
    OstWalletSdkEvents.unsubscribeEvent();
  }

  render() {
    return (
      <Provider store={Store}>
        <RootNavigationContainer />
      </Provider>
    );
  }
}