import React from 'react';
import { Alert } from 'react-native';

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
    this.authCredentialListener = null;
  }

  componentDidMount() {
    /**
     * subscribe to credential updates.This returns a function which can be used to remove the event listener
     * when the component unmounts.
     */
    if(appleAuth.isSupported) {
      this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
        this.logout();
      });
    }
    AppleAuthEmitter.on('appleSignIn', ()=> this.signIn());
  }

  componentWillUnmount() {
    /**
     * cleans up event listener
     */
    this.authCredentialListener = null;
  }

   logout = async() =>  {
        // performs logout request
        const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGOUT,
        });
        console.log("User logged out", appleAuthRequestResponse);
    }
  
    signIn = async () => {
      if(appleAuth.isSupported) {
        console.warn('Beginning Apple Authentication');

        // start a login request
        try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [
            AppleAuthRequestScope.EMAIL,
            AppleAuthRequestScope.FULL_NAME,
            ],
        });
        AppleAuthService.signUp()

        console.log('appleAuthRequestResponse', appleAuthRequestResponse);

        } catch (error) {
        if (error.code === AppleAuthError.CANCELED) {
            Alert.alert('User canceled Apple Sign in.');
        } else {
            console.log(error);
        }
        }
      }    
    };

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
