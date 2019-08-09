import utilities from '../services/Utilities';
import PepoApi from '../services/PepoApi';
import deepGet from 'lodash/get';
import Store from '../store';
import { updateCurrentUser, logoutUser } from '../actions';
import NavigationService from '../services/NavigationService';
import appConfig from '../constants/AppConfig';
import { LoginPopoverActions } from '../components/LoginPopover';
import reduxGetter from '../services/ReduxGetters';
import InitWalletSdk from '../services/InitWalletSdk';
import { FlyerEventEmitter } from '../components/CommonComponents/FlyerHOC';

class CurrentUser {
  constructor() {
    this.userId = null;
  }

  initialize() {
    //Provide user js obj in  a promise.
    this.userId = null;
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
        Store.dispatch(updateCurrentUser(user));
        this.userId = userId;
        setupDevice && InitWalletSdk.initializeDevice(this);
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
      Store.dispatch(logoutUser());
      await utilities.removeItem(this._getCurrentUserIdKey());
      await utilities.removeItem(this._getASKey(userId));
    } catch (e) {
      console.log('clearCurrentUser gaved error!', e);
    }
  }

  login(params) {
    return this._signin('/auth/login', params);
  }

  signUp(params) {
    return this._signin('/auth/sign-up', params);
  }

  twitterConnect(params) {
    return this._signin('/auth/twitter-login', params);
  }

  async logout(params) {
    await this.clearCurrentUser();
    new PepoApi('/auth/logout')
      .post()
      .catch((error) => {})
      .then((res) => {
        NavigationService.navigate('HomeScreen', params);
      });
  }

  _signin(apiUrl, params) {
    let authApi = new PepoApi(apiUrl);
    return authApi.post(JSON.stringify(params)).then((apiResponse) => {
      return this._saveCurrentUser(apiResponse)
        .catch()
        .then(() => {
          return apiResponse;
        });
    });
  }

  getUserSalt() {
    return new PepoApi('/users/recovery-info').get();
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
    const userStatusMap = appConfig.userStatusMap;
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

  // Start Move this to utilities once all branches are merged.
  checkActiveUser() {
    if (!this.getOstUserId()) {
      LoginPopoverActions.show();
      return false;
    }
    return true;
  }

  isUserActivated(emit) {
    const userStatusMap = appConfig.userStatusMap,
      returnVal = this.__getUserStatus() == userStatusMap.activated;
    if (!returnVal && emit) {
      FlyerEventEmitter.emit('onShowProfileFlyer', { id: 1 });
    }
    return returnVal;
  }
  // End Move this to utilities once all branches are merged.

  setupDeviceFailed(ostWorkflowContext, error) {
    console.log('----- IMPORTANT :: SETUP DEVICE FAILED -----');
  }

  setupDeviceComplete() {}
}

export default new CurrentUser();
