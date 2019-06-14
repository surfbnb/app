import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar , Alert} from 'react-native';
import utilities from "../../services/Utilities";
import errorMessages from "../../constants/ErrorMessages";
import styles from './styles';
import currentUserModal from "../../models/CurrentUser";
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import {PLATFROM_API_ENDPOINT} from "../../constants";


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
  }

  onSdkInitialized = (ostError, success) => {
    t2 = Date.now();
    console.log("onSdkInitialized. OstWalletSdk.initialize took:", (t2 - t1 ), "miliseconds" );
    currentUserModal.initialize()
    .then(( user) => {
      if( !user ){
        this.props.navigation.navigate('AuthScreen');
        return ; 
      }
      if(!utilities.isActiveUser( user )){
        this.props.navigation.navigate('SetPinScreen');
      }else{
        this.props.navigation.navigate('HomeScreen');
      }
    })
    .catch(() => {
      Alert.alert("" , errorMessages.general_error);
    });
  }

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


