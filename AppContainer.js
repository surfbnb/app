import React, { Component } from 'react';
import { OstWalletSdkEvents } from '@ostdotcom/ost-wallet-sdk-react-native';

import App from './App';

export default class AppContainer extends Component {
  componentDidMount() {
    OstWalletSdkEvents.subscribeEvent();
  }

  componentWillUnmount() {
    OstWalletSdkEvents.unsubscribeEvent();
  }

  render() {
    return <App />;
  }
}
