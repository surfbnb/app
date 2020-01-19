import React from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import appleAuth, {
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import {AppleAuthEmitter} from '../../helpers/Emitters';

let AppleAuthService;
import('../../services/AuthServices/AppleAuthService').then((imports) => {
  AppleAuthService = imports.default;
});


export class AppleLogin extends React.Component {
  constructor() {
    super();
    // this.authCredentialListener = null;
  }

  componentDidMount() {
    //DO NOT UNCOMMENT because need to check why onCredentialRevoked() opens auth dialog again after login
    /**
     * subscribe to credential updates.This returns a function which can be used to remove the event listener
     * when the component unmounts.
     */
    // if(appleAuth.isSupported) { 
    //   this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
    //     this.logout();
    //   });
    // }
    AppleAuthEmitter.on('appleSignIn', ()=> this.signIn());
  }

  componentWillUnmount() {
    /**
     * cleans up event listener
     */
    // this.authCredentialListener = null;
    AppleAuthEmitter.removeListener('appleSignIn');
  }

  //  logout = async() =>  {
  //       // performs logout request
  //       const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: AppleAuthRequestOperation.LOGOUT,
  //       });
  //       console.log("User logged out", appleAuthRequestResponse);
  //   }
  
    signIn = async () => {
      if(appleAuth.isSupported) {
        console.warn('Beginning Apple Authentication');

        // start a login request
        try {
        const response = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [
            AppleAuthRequestScope.EMAIL,
            AppleAuthRequestScope.FULL_NAME,
            ],
        });
        AppleAuthService.signUp( response );

        } catch (error) {
        if (error.code === AppleAuthError.CANCELED) {
            Alert.alert('User canceled Apple Sign in.');
        } else {
            console.log(error);
        }
        }
      }    
    };

    getUserDataFromAsync = ( response ) => {
      return AsyncStorage.getItem(`appleUser${response.user}`);
    }

    //Save response to async as apple return email and other details only on first login
    saveResponseToAsync = ( response )=> {
      if(!this.getUserDataFromAsync( response )){
        AsyncStorage.setItem(`appleUser${response.user}`, JSON.stringify(response));
      }
    }

  render() {
      return (
          <React.Fragment/>
      )
  }
}

export default {
    signIn : () => {
        AppleAuthEmitter.emit('appleSignIn');
    }
  };
