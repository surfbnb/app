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

  getTopLevelNavigation(){
    return this.navigation;
  }

  //navigation is a mandatory param
  navigate(goToObject, navigation, payload) {
    goToObject = goToObject || {};
    this.setTopLevelNavigation(navigation);

    let pn = deepGet(goToObject, 'pn');

    switch (pn) {
      case 'p':
        this.goToProfilePage(deepGet(goToObject, 'v.puid'), payload, goToObject);
        break;
      case 'v':
        this.goToVideo(deepGet(goToObject, 'v.vid'), payload);
        break;
      case 'rd':
        this.goToVideoReply(deepGet(goToObject, 'v.rdi'), deepGet(goToObject, 'v.pvi'), payload);
        break;
      case 'f':
        this.__navigate('Home', payload);
        break;
      case 'nc':
        this.__navigate('Notification', payload);
        break;
      case 'e':
        this.__push('AddEmailScreen', payload);
        break;
      case 'cb':
        this.__push('SupportersListScreen', payload, 'userId', deepGet(goToObject, 'v.puid'));
        break;
      case 'ct':
        this.__push('SupportingListScreen', payload, 'userId', deepGet(goToObject, 'v.puid'));
        break;
      case 'iu':
        this.goToInvitedUsers(payload);
        break;
      case 'wv':
        InAppBrowser.openBrowser(deepGet(goToObject, 'v.wu'))
        break;
      case 'su':
        this.goToSupport();
        break;
      case 'sp':
        this.goToStore();
        break;
      case 't':
        this.__push('VideoTags', payload, 'tagId', deepGet(goToObject, 'v.tid'));
        break;
      case 'ch':
        this.__push('ChannelsScreen', payload, 'channelId', deepGet(goToObject, 'v.cid'));
        break;
      default:
        console.log('Unhandled navigateTo: ', goToObject, payload);
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

  goToVideoReply = (rdId, pvId, payload) => {
    let timeOut = 0 ;
    payload = payload || {};
    payload['replyDetailId'] = rdId;
    payload['parentVideoId'] = pvId;
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

  goToProfilePage = (id, payload={}, goToObj) => {
    if (id == CurrentUser.getUserId()) {
      this.__navigate('ProfileScreen', payload);
    } else {
      payload = payload ;
      payload['userId'] = id;
      payload['goTo'] = goToObj;
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

  __push(screenName, payload, idKey, idValue) {
    if (!screenName || !this.navigation) return;
    payload = payload || {};
    if(idKey && idValue) payload[idKey] = idValue;
    this.navigation.push(screenName, payload);
  }

  setGoTo(goTo) {
    if (goTo && goTo.pn === 's') {
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
