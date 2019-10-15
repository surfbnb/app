import deepGet from 'lodash/get';

import Toast from '../theme/components/NotificationToast';
import { upsertInviteCode } from '../actions';
import Store from '../store';

let LoginPopoverActions = null;
import('../components/LoginPopover').then((pack) => {
  LoginPopoverActions = pack.LoginPopoverActions;
});

let CurrentUser;
import('../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

let Utilities;
import('./Utilities').then((imports) => {
  Utilities = imports.default;
});

import TwitterAuth from './ExternalLogin/TwitterAuth';
import AppConfig from '../constants/AppConfig';
import NavigationService from './NavigationService';
import { navigateTo } from '../helpers/navigateTo';
import Pricer from './Pricer';

class TwitterAuthService {
  signUp() {
    TwitterAuth.signIn()
      .then(async (params) => {
        if (params) {
          let inviteCode = await Utilities.getItem(AppConfig.appInstallInviteCodeASKey);
          if (inviteCode) {
            params['invite_code'] = inviteCode;
          }
          CurrentUser.twitterConnect(params)
            .then((res) => {
              if (res && res.success) {
                this.onSuccess(res);
              } else {
                this.onServerError(res);
              }
            })
            .catch((err) => {
              this.onServerError(err);
            })
            .finally(() => {
              LoginPopoverActions.hide();
            });
        } else {
          LoginPopoverActions.hide();
          console.log('No user data!');
        }
      })
      .catch((error) => {
        LoginPopoverActions.hide();
        this.onServerError(error);
      });
  }

  onSuccess(res) {
    Utilities.removeItem(AppConfig.appInstallInviteCodeASKey);
    Store.dispatch(upsertInviteCode(null));
    Pricer.getBalance();
    if (this.handleGoTo(res)) {
      return;
    }
    navigateTo.navigationDecision();
  }

  logout() {
    TwitterAuth.signOut();
  }

  onServerError(error) {
    if (this.handleGoTo(error)) {
      return;
    }
    Toast.show({
      text: 'Unable to login with Twitter',
      icon: 'error'
    });
  }

  handleGoTo(res) {
    //On success goto can be handled by the generic utility
    if (navigateTo.handleGoTo(res)) {
      return true;
    }
    let errorData = deepGet(res, 'err.error_data');
    if (res && this.isInviteCodeError(errorData)) {
      //Goto invite screen
      NavigationService.navigate('InviteCodeScreen');
      return true;
    }
    return false;
  }

  isInviteCodeError(errorObj) {
    for (i in errorObj) {
      if (errorObj[i].parameter === 'invite_code') {
        return true;
      }
    }
    return false;
  }
}

export default new TwitterAuthService();
