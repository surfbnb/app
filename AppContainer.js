import React, { Component } from 'react';
import {Platform} from "react-native";
import { OstWalletSdkEvents } from '@ostdotcom/ost-wallet-sdk-react-native';

import RootNavigationContainer from './RootNavigationContainer';
import Store from './src/store';
import { Provider } from 'react-redux';

import RNIap, {
  ProductPurchase,
  purchaseUpdatedListener,
  purchaseErrorListener,
} from 'react-native-iap';
 
const itemSkus = Platform.select({
  ios: [
    'pd1'
  ],
  android: [
    'com.pepo.staging.pp123p_123', 'pp123p_123', 'pd1' , 'com.pepo.staging.pd1'
  ]
});

let purchaseUpdateSubscription , purchaseErrorSubscription;
let allProducts ; 

export default class AppContainer extends Component {


  componentDidMount() {
    OstWalletSdkEvents.subscribeEvent();
    try {
      RNIap.initConnection().then((res)=> {
        console.log("initConnection", res); 
        RNIap.getProducts(itemSkus).then(( products ) => {
          allProducts = products ;
          console.log("Initialize in-app payment", products );
          setImmediate(()=> {
            this.requestPurchase( allProducts[0]["productId"] ); 
          } , 2000 )
        }).catch(( error )=> {
          console.warn("Unable to initialize in-app payment." , error);
        });
      }).catch((error)=> {
        console.log("initConnection", error);
      })
 
    } catch(error) {
      console.warn("Unable to initialize in-app payment." , error);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(( res ) => {
      console.log('purchaseUpdatedListener', res);
    });
    purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.log('purchaseErrorListener', error);
    });

  }

  requestPurchase = async(sku) => {
    try {
      RNIap.requestPurchase(sku);
    } catch (err) {
      console.log("requestPurchase error" , err.code, err.message);
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
