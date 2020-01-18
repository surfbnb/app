import PepoApi from '../services/PepoApi';
import deepGet from 'lodash/get';
import Store from '../store';
import { updateCurrentUser, logoutUser } from '../actions';
import NavigationService from '../services/NavigationService';
import reduxGetter from '../services/ReduxGetters';
import InitWalletSdk from '../services/InitWalletSdk';
import Toast from '../theme/components/NotificationToast';
import OstWorkflowDelegate from '../helpers/OstWorkflowDelegate';
import EventEmitter from "eventemitter3";
import {navigateTo} from "../helpers/navigateTo";
import AppConfig from '../constants/AppConfig';
import LastLoginedUser from "./LastLoginedUser";

const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking'); 

let utilities = null;
import('../services/Utilities').then((pack) => {
  utilities = pack.default;
});

let PushNotificationMethods = null;
import('../services/PushNotificationManager').then((pack) => {
  PushNotificationMethods = pack.PushNotificationMethods;
});

let FlyerEventEmitter = null;
import('../components/CommonComponents/FlyerHOC').then((pack) => {
  FlyerEventEmitter = pack.FlyerEventEmitter;
});

class CurrentUser {
  constructor() {
    this.userId = null;
    this.isSync =  false;
    this.event = new EventEmitter();
  }

  initialize() {
    //Provide user js obj in  a promise.
    this.userId = null;
    LastLoginedUser.initialize();
    return this.currentUserIdFromAS().then((asUserId) => {
      if (!asUserId) {
        Promise.resolve(null);
      }
      return this.userFromAS(asUserId).then((userStr) => {
        if (!userStr) {
          //User json not found in AS.
          return null;
        }
        let userObj;
        try {
          userObj = JSON.parse(userStr);
        } catch (e) {
          // Something unexpected in AS.
          // As good as user not found in AS.
          // Remove the data from AS. But, dont wait for it.
          this.clearCurrentUser(asUserId);
          return null;
        }

        //We now have userObj.
        return this.sync(userObj.user_id, true);
      });
    });
  }

  getLogedinUser() {
    return Store.getState().current_user;
  }

  getUser() {
    return reduxGetter.getUser(this.userId);
  }

  getEvent(){
    return this.event ;
  }

  updateActivatingStatus() {
    return new PepoApi('/users/activation-initiate')
      .post()
      .then((apiResponse) => {
        return this._saveCurrentUser(apiResponse)
          .catch()
          .then(() => {
            return apiResponse;
          });
      })
      .catch((err) => {
        console.log('updateActivatingStatus', err);
      });
  }

  sync(userId, setupDevice) {
    //Sync user with server. Return user js obj in a promise.
    userId = userId || this.userId;
    if (!userId) return Promise.resolve();
    return new PepoApi('/users/current')
      .get()
      .then((apiResponse) => {
        return this._saveCurrentUser(apiResponse, userId, setupDevice);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  _saveCurrentUser(apiResponse, expectedUserId, setupDevice) {
    const resultType = deepGet(apiResponse, 'data.result_type');
    if (!resultType) {
      // Api did not give logged-in user.
      return Promise.resolve(null);
    }
    let user = deepGet(apiResponse, `data.${resultType}`);
    let userId = user.user_id;
    if (expectedUserId) {
      // Make sure it matched.
      if (expectedUserId != userId) {
        // Dont save.
        return Promise.resolve();
      }
    }
    return utilities
      .saveItem(this._getASKey(userId), user)
      .then(() => {
        return utilities.saveItem(this._getCurrentUserIdKey(), userId);
      })
      .then(() => {
        this.userId = userId;
        Store.dispatch(updateCurrentUser(user));
        if (setupDevice) {
          return InitWalletSdk.promisifiedSetupDevice()
            .then((res) => {
              return user;
            })
            .catch((error) => {
              console.log('setup device failed', error);
              //DO NOTHING Unexpected error.
            });
        }
        return user;
      });
  }

  // Async storage methods.
  currentUserIdFromAS() {
    return utilities.getItem(this._getCurrentUserIdKey());
    //Last user-id key is "last_user_id";
  }

  userFromAS(userId) {
    userId = userId || this.userId;
    //User key is "user-" + userId;
    // Get from as.
    return utilities.getItem(this._getASKey(userId));
  }

  async clearCurrentUser(userId) {
    try {
      userId = userId || this.userId;
      this.userId = null;
      //TODO add await
      Store.dispatch(logoutUser());
      await utilities.removeItem(this._getCurrentUserIdKey());
      await utilities.removeItem(this._getASKey(userId));
    } catch (e) {
      console.log('clearCurrentUser gaved error!', e);
    }
  }

  twitterConnect(params) {
    return this._signin('/auth/twitter-login', params);
  }

  async logout(params) {
    this.getEvent().emit("onBeforeUserLogout");
    await new PepoApi('/auth/logout')
      .post(params)
      .then((res) => {
        LastLoginedUser.updateASUserOnLogout(this.getUserId());
        this.onLogout( res , params );
      })
      .catch((error) => {
        Toast.show({
          text: 'Logout failed please try again.',
          icon: 'error'
        });
        this.getEvent().emit("onUserLogoutFailed");
      });
  }

  async onLogout( params ){ 
    return RCTNetworking.clearCookies(async () => {
       this.getEvent().emit("onUserLogout");
       navigateTo.resetAllNavigationStack();
       await this.clearCurrentUser();
       PushNotificationMethods.deleteToken();
       //Remove this timeout once redux logout is promise based.
       setTimeout(()=> {
         NavigationService.navigate('HomeScreen' , params);
         this.getEvent().emit("onUserLogoutComplete");
       } , AppConfig.logoutTimeOut );
    });
  }

  async logoutLocal(params) {
    await RCTNetworking.clearCookies(async () => {
      await this.clearCurrentUser();
      NavigationService.navigate('HomeScreen', params);
    });
  }

  _signin(apiUrl, params) {
    let authApi = new PepoApi(apiUrl);
    return authApi.post(JSON.stringify(params)).then((apiResponse) => {
      return this._saveCurrentUser(apiResponse, null, true)
        .catch()
        .then(() => {
          LastLoginedUser.updateASUserOnLogin(apiResponse);
          return apiResponse;
        });
    });
  }

  getUserSalt() {
    return new PepoApi('/users/recovery-info').get();

    //TODO: Someday, in far future, uncomment below code.
    // if ( _canFetchSalt ) {
    //   _canFetchSalt = false;
    //   return new PepoApi('/users/recovery-info').get();
    // }
    // return Promise.reject("illegalaccesserror tried to access method.");
  }

  newPassphraseDelegate() {
    let delegate = new OstWorkflowDelegate(this.getOstUserId(), this);
    this.bindSetPassphrase(delegate);
    return delegate;
  }

  bindSetPassphrase(uiWorkflowCallback) {
    Object.assign(uiWorkflowCallback, {
      getPassphrase: (userId, ostWorkflowContext, passphrasePrefixAccept) => {
        return _getPassphrase(this, uiWorkflowCallback, passphrasePrefixAccept);
      }
    });
  }

  // Simple getter/setter methods.
  getUserId() {
    return this.userId;
  }

  getOstUserId() {
    const user = this.getUser() || {};
    return user['ost_user_id'];
  }

  isActiveUser() {
    return this.isUserActivated() || this.isUserActivating();
  }

  isUserActivating() {
    const userStatusMap = AppConfig.userStatusMap;
    return this.__getUserStatus() == userStatusMap.activating;
  }

  isAirDropped() {
    const currentUser = this.getLogedinUser() || {};
    return currentUser['signup_airdrop_status'] == 1;
  }

  __getUserStatus() {
    const user = this.getUser();
    let status = deepGet(user, 'ost_status') || '';
    return status.toLowerCase();
  }

  _getASKey(userId) {
    return 'user-' + userId;
  }

  _getCurrentUserIdKey() {
    return 'current_user_id';
  }

  setSyncState( state ){
    this.isSync = !!state; 
  }

  getSyncState(  ){
    return this.isSync ;  
  }

  isUserActivated(emit) {
    const userStatusMap = AppConfig.userStatusMap,
      returnVal = this.__getUserStatus() == userStatusMap.activated;
    if (!returnVal && emit) {
      FlyerEventEmitter.emit('onShowProfileFlyer', { id: 1 });
    }
    return returnVal;
  }
  // End Move this to utilities once all branches are merged.
}

const _getPassphrase = (currentUserModel, workflowDelegate, passphrasePrefixAccept) => {
  if (!_ensureValidUserId(currentUserModel, workflowDelegate, passphrasePrefixAccept)) {
    passphrasePrefixAccept.cancelFlow();
    return Promise.resolve();
  }

  _canFetchSalt = true;
  const getSaltPromise = currentUserModel
    .getUserSalt()
    .then((res) => {
      if (!_ensureValidUserId(currentUserModel, workflowDelegate, passphrasePrefixAccept)) {
        return;
      }

      if (res.success && res.data) {
        let resultType = deepGet(res, 'data.result_type'),
          passphrasePrefixString = deepGet(res, `data.${resultType}.scrypt_salt`);

        if (!passphrasePrefixString) {
          passphrasePrefixAccept.cancelFlow();
          workflowDelegate.saltFetchFailed(res);
          return;
        }

        passphrasePrefixAccept.setPassphrase(passphrasePrefixString, currentUserModel.getOstUserId(), () => {
          passphrasePrefixAccept.cancelFlow();
          workflowDelegate.saltFetchFailed(res);
        });
      }
    })
    .catch((err) => {
      if (_ensureValidUserId(currentUserModel, workflowDelegate, passphrasePrefixAccept)) {
        passphrasePrefixAccept.cancelFlow();
        workflowDelegate.saltFetchFailed(err);
      }
    });
  _canFetchSalt = false;

  return getSaltPromise;
};

const _ensureValidUserId = (currentUserModel, workflowDelegate, passphrasePrefixAccept) => {
  if (currentUserModel.getOstUserId() === workflowDelegate.userId) {
    return true;
  }

  // Inconsistent UserId.
  passphrasePrefixAccept.cancelFlow();
  workflowDelegate.inconsistentUserId(workflowDelegate.userId, currentUserModel.getOstUserId());
  return false;
};

let _canFetchSalt = false;

export default new CurrentUser();
