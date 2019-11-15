import {Linking, Platform} from 'react-native';

import deepGet from 'lodash/get';
import NavigationService from '../services/NavigationService';
import InAppBrowser from '../services/InAppBrowser';
import { LoginPopoverActions } from '../components/LoginPopover';
import AppConfig from '../constants/AppConfig';
import { upsertInviteCode } from '../actions';
import Store from '../store';
import PepoApi from "../services/PepoApi";
import DataContract from '../constants/DataContract';

let CurrentUser;
import('../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

let Utilities;
import('../services/Utilities').then((imports) => {
  Utilities = imports.default;
});

class NavigateTo {
  constructor() {
    this.navigation = null;
    this.goTo = null;
  }

  setTopLevelNavigation(navigation) {
    if (!navigation) return;
    this.navigation = navigation;
  }

  //navigation is a mandatory param
  navigate(goToObject, navigation, payload) {
    goToObject = goToObject || {};
    this.setTopLevelNavigation(navigation);
    if (goToObject && goToObject.pn === 'p') {
      this.goToProfilePage(goToObject.v.puid, payload);
    } else if (goToObject && goToObject.pn === 'cb') {
      this.goToSupporters(goToObject.v.puid, payload);
    } else if (goToObject && goToObject.pn === 'v') {
      this.goToVideo(goToObject.v.vid, payload);
    }else if (goToObject && goToObject.pn === 'rd') {
      this.goToVideoReply(goToObject.v.rdi, payload);
    } else if (goToObject && goToObject.pn === 'f') {
      this.__navigate('Home', payload);
    } else if (goToObject && goToObject.pn === 'nc') {
      this.__navigate('Notification', payload);
    } else if (goToObject.pn === 'e') {
      this.__push('AddEmailScreen', payload);
    } else if (goToObject && goToObject.pn === 'ct') {
      this.goToSupportings(goToObject.v.puid, payload);
    } else if (goToObject && goToObject.pn === 'iu'){
      this.goToInvitedUsers(payload);
    } else if (goToObject && goToObject.pn === 'wv'){
      InAppBrowser.openBrowser(goToObject.v.wu)
    } else if (goToObject && goToObject.pn === 'su'){
      this.goToSupport();
    } else if (goToObject && goToObject.pn === 'sp'){
      this.goToStore();
    } else if (goToObject && goToObject.pn == 't'){
      this.goToTagVideoPage(goToObject.v.tid, payload);
    }
  }

  goToSupport(){
    new PepoApi(DataContract.support.infoApi)
        .get()
        .then((response) => {
          if(response && response.success){
            let result_type = deepGet(response, 'data.result_type'),
                payload;
            if(result_type){
              payload = response.data[ result_type ];
            }
            payload && InAppBrowser.openBrowser( payload.url );
          }
        });
  }

  goToStore(){
    new PepoApi(DataContract.redemption.openRedemptionWebViewApi)
        .get()
        .then((response)=> {
          if(response && response.success){
            let resultType = deepGet(response , `${DataContract.common.resultType}`) ,
                data = deepGet(response, `data.${resultType}` ),
                url = data && data.url;
            ;
            url && Linking.openURL(url);
          }
        });
  }

  goToSignUp(inviteCode, payload ){
    if(CurrentUser.isActiveUser())return;
    LoginPopoverActions.show();
  }

  _setInviteCode(inviteCode){
    if(inviteCode){
        Utilities.saveItem(AppConfig.appInstallInviteCodeASKey, inviteCode);
        Store.dispatch(upsertInviteCode(inviteCode));
    }
}

  goToInvitedUsers = (payload)=> {
    this.__push('Invites', payload);
  }

  goToVideo = (vId, payload) => {
    let timeOut = 0 ;
    payload = payload || {};
    payload['videoId'] = vId;
    if(NavigationService.getActiveTab() != "Notification"){
      timeOut = 100;
      this.__navigate('NotificationScreen', payload);
    }
    //Once migrated to react-navigation version 4 remove the settimeout code
    //as version 3 dosent provides navigation chaining.
    setTimeout(()=> {
      this.__push('VideoPlayer', payload);
    }, timeOut)
  };

  goToVideoReply = (rdId, payload) => {
    let timeOut = 0 ;
    payload = payload || {};
    payload['replyDetailId'] = rdId;
    if(NavigationService.getActiveTab() != "Notification"){
      timeOut = 100;
      this.__navigate('NotificationScreen', payload);
    }
    //Once migrated to react-navigation version 4 remove the settimeout code
    //as version 3 dosent provides navigation chaining.
    setTimeout(()=> {
      this.__push('VideoReplyPlayer', payload);
    }, timeOut)
  };

  goToSupportings = (profileId, payload) => {
    payload = payload || {};
    payload['userId'] = profileId;
    this.__push('SupportingListScreen', payload);
  };

  goToTagVideoPage = (tagId, payload) => {
    payload = payload || {};
    payload['tagId'] = tagId;
    this.__push('VideoTags', payload);
  };

  goToSupporters = (profileId, payload) => {
    payload = payload || {};
    payload['userId'] = profileId;
    this.__push('SupportersListScreen', payload);
  };

  goToProfilePage = (id, payload) => {
    if (id == CurrentUser.getUserId()) {
      this.__navigate('ProfileScreen', payload);
    } else {
      payload = payload || {};
      payload['userId'] = id;
      this.__push('UsersProfileScreen', payload);
    }
  };

  handleGoTo(res, navigation, payload) {
    if (!res) return;
    let isGoto = !!deepGet(res, 'data.go_to.pn');
    if (isGoto) {
      //Just to avoid goback conflict, excequte last.
      setTimeout(() => {
        this.navigate(res.data.go_to, navigation, payload);
      }, 0);
      return true;
    }
    return false;
  }

  isWebViewLink(){
    return deepGet(this.getGoTo() , 'pn') ==  'wv';
  }

  //Call this function if you want to navigate to screens only if logind user or webview redirects.
  //Eg: UniversalLinkWorker or PushNotificationWorker
  shouldNavigate( goToHome ){
    if(CurrentUser.isActiveUser() || this.isWebViewLink()) {
      this.__goToNavigationDecision( goToHome );
   }
  }

  //This is a controlled navigation for internals flows only.
  navigationDecision( goToHome ) {
    if (CurrentUser.getUser() && !CurrentUser.isActiveUser()) {
      this.__navigate('UserActivatingScreen');
      return;
    }
    this.__goToNavigationDecision( goToHome);
  }

  __goToNavigationDecision(goToHome) {
    if (this.__isGoto()) {
      this.navigate(this.getGoTo());
      this.clearGoTo();
    } else if (goToHome) {
      this.__navigate('HomeScreen');
    }
  }

  __navigate(screenName, payload) {
    if (!screenName) return;
    if (this.navigation) {
      this.navigation.navigate(screenName, payload);
    } else {
      NavigationService.navigate(screenName, payload);
    }
  }

  __push(screenName, payload) {
    if (!screenName || !this.navigation) return;
    this.navigation.push(screenName, payload);
  }

  setGoTo(goTo) {
    if (goTo && goTo.pn == 's') {
      this._setInviteCode(goTo.v.ic);
      return;
    }
    this.goTo = goTo;
  }

  getGoTo() {
    return this.goTo;
  }

  clearGoTo() {
    this.goTo = null;
  }

  resetAllNavigationStack() {
    NavigationService.reset(this.navigation);
  }

  __isGoto() {
    return this.goTo && Object.keys(this.goTo).length > 0;
  }
}

const navigateTo = new NavigateTo();

export { navigateTo };
