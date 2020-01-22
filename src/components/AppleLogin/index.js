import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import appleAuth, {
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import {AppleAuthEmitter} from '../../helpers/Emitters';
import Toast from '../../theme/components/NotificationToast';
import {globalEvents,  globalEventsMap} from "../../helpers/GlobalEvents";

let AppleAuthService;
import('../../services/AuthServices/AppleAuthService').then((imports) => {
  AppleAuthService = imports.default;
});


export class AppleLogin extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    AppleAuthEmitter.on('appleSignIn', ()=> this.signIn());
  }

  componentWillUnmount() {
    AppleAuthEmitter.removeListener('appleSignIn');
  }
  
    signIn = async () => {
      if(appleAuth.isSupported) {
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
          globalEvents.emit(globalEventsMap.oAuthCancel , error);
        } else {
          Toast.show({text: `Failed to login via Apple`, icon: 'error' });
          globalEvents.emit(globalEventsMap.oAuthError , error);
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
