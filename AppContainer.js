import React, { Component } from 'react';
import { OstWalletSdkEvents } from '@ostdotcom/ost-wallet-sdk-react-native';

import App from './App';
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
        <App />
      </Provider>
    );
  }
}
