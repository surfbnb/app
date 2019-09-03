import React, { Component } from 'react';
import {Platform} from "react-native";
import { OstWalletSdkEvents } from '@ostdotcom/ost-wallet-sdk-react-native';

import RootNavigationContainer from './RootNavigationContainer';
import Store from './src/store';
import { Provider } from 'react-redux';

import * as RNIap from 'react-native-iap';
 
const itemSkus = Platform.select({
  ios: [
    'pepostaging1'
  ],
  android: [
    'pepostaging1'
  ]
});

export default class AppContainer extends Component {
  componentDidMount() {
    OstWalletSdkEvents.subscribeEvent();
    try {
      RNIap.getProducts(itemSkus).then(( products ) => {
        console.log("Initialize in-app payment", products );
      }).catch(( error )=> {
        console.warn("Unable to initialize in-app payment." , error);
      });
    } catch(error) {
      console.warn("Unable to initialize in-app payment." , error);
    }
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
