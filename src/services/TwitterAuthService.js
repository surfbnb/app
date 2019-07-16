

import { NativeModules } from 'react-native';
import { LoadingModal } from '../theme/components/LoadingModalCover';
import deepGet from 'lodash/get';
import { ostErrors } from './OstErrors';
import InitWalletSdk from './InitWalletSdk';
import Store from '../store';
import { hideLoginPopover } from '../actions';
import NavigationService from './NavigationService';
import { Toast } from 'native-base';
import { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } from '../constants';
import Pricer from './Pricer';

const { RNTwitterSignIn } = NativeModules;

let currentUserModal;
import('../models/CurrentUser').then((imports) => {
  currentUserModal = imports.default;
});

class TwitterAuthService {
  signUp() {
    const oThis = this;
    this._signIn()
      .then((loginData) => {
        console.log(loginData);
        if (loginData) {
          let params = this.getParams(loginData);
          LoadingModal.show('Connecting...');
          currentUserModal
            .twitterConnect(params)
            .then((res) => {
              if (res.success && res.data) {
                let resultType = deepGet(res, 'data.result_type'),
                  userData = deepGet(res, 'data.' + resultType);
                if (!userData) {
                  LoadingModal.hide();
                  Toast.show({
                    text: ostErrors.getErrorMessage(res),
                    buttonText: 'Okay'
                  });
                  return;
                }
                Pricer.getBalance();
                InitWalletSdk.initializeDevice(oThis);
              } else {
                this.onServerError(res);
              }
            })
            .catch((err) => {
              this.onServerError(err);
            });
        } else {
          console.log('No user data!');
        }
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          text: ostErrors.getErrorMessage(error),
          buttonText: 'Okay'
        });
      }).finally( () => {
         Store.dispatch(hideLoginPopover());
    })
  }

  getParams(loginData) {
    return {
      token: loginData.authToken,
      secret: loginData.authTokenSecret,
      twitter_id: loginData.userID,
      handle: loginData.userName
    };
  }

  logout() {
    this._signout();
  }

  setupDeviceComplete() {
    LoadingModal.hide();
    if (!currentUserModal.isActiveUser()) {
      NavigationService.navigate('UserActivatingScreen');
    } else {
      NavigationService.navigate('HomeScreen');
    }
  }

  setupDeviceFailed(ostWorkflowContext, error) {
    this.onServerError(error);
  }

  onServerError(res) {
    LoadingModal.hide();
    Toast.show({
      text: ostErrors.getErrorMessage(res),
      buttonText: 'Okay'
    });
  }

  _signIn() {
    RNTwitterSignIn.init(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
    return RNTwitterSignIn.logIn();
  }

  _signout() {
    RNTwitterSignIn.logOut();
  }
}

export default new TwitterAuthService();
