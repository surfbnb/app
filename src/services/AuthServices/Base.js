import deepGet from 'lodash/get';
import assignIn from 'lodash/assignIn';
import Toast from '../../theme/components/NotificationToast';
import { upsertInviteCode } from '../../actions';
import Store from '../../store';

let LoginPopoverActions = null;
import('../../components/LoginPopover').then((pack) => {
  LoginPopoverActions = pack.LoginPopoverActions;
});

let CurrentUser;
import('../../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

let Utilities;
import('../Utilities').then((imports) => {
  Utilities = imports.default;
});
import AppConfig from '../../constants/AppConfig';
import NavigationService from '../NavigationService';
import { navigateTo } from '../../helpers/navigateTo';
import Pricer from '../Pricer';
import DataContract from '../../constants/DataContract';
import PixelCall from '../PixelCall';
import TwitterOAuth from "../ExternalLogin/TwitterOAuth";
import {DrawerEmitter} from "../../helpers/Emitters";
import DeviceInfo from "react-native-device-info";

class Base {

  constructor(){}

  async signUp(paramsFromService) {
    LoginPopoverActions.showConnecting();
    let params = this.getParamsForServer(paramsFromService);

    if (params) {
      let inviteCode = await Utilities.getItem(AppConfig.appInstallInviteCodeASKey);
      if (inviteCode) {
        params['invite_code'] = inviteCode;
      }
      this.connectToServer(params)
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
    }
  }


  onSuccess(res) {
    this.pixelDrop(res);
    Utilities.removeItem(AppConfig.appInstallInviteCodeASKey);
    Store.dispatch(upsertInviteCode(null));
    Pricer.getBalance();
    if (this.handleGoTo(res)) {
      return;
    }
    navigateTo.navigationDecision();
  }

  pixelDrop( res={} ){
    const data = res.data|| {},
      meta = data.meta;
    if(meta && !!meta.is_registration){
      const resultType = deepGet(res , DataContract.common.resultType ) ,
        entity = deepGet(res, `data.${resultType}` , {}),
        utm = data["utm_params"]  ,
        inviteCode = meta["invite_code"] ,
        createdAt = entity['uts'],
        pixelParams = this.getPixeDropParams(createdAt , inviteCode , utm )
      ;
      PixelCall( pixelParams );
    }
  }

  getPixeDropParams(createdAt, inviteCode , utm){
    let params = this.getPixelMandatoryParams();
    if(createdAt){
      params["registration_at"] = createdAt;
    }
    if(inviteCode){
      params["invite_code"] = inviteCode;
    }
    if(utm){
      params = assignIn({}, params , utm );
    }
    return params ;
  }

  handleGoTo(res) {
    //On success goto can be handled by the generic utility
    if (navigateTo.handleGoTo(res)) {
      return true;
    }
    let errorData = deepGet(res, 'err.error_data');
    /*
    * We dont have to ask for invite code now
    * 
    */
    // if (res && this.isInviteCodeError(errorData)) {
    //   //Goto invite screen
    //   NavigationService.navigate('InviteCodeScreen');
    //   return true;
    // }
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

  beforLogout(){
    CurrentUser.getEvent().emit("onBeforeUserLogout");
  }

  logout() {
    throw 'Need to implement in child';
  }

  onLogout = () => {
    DrawerEmitter.emit('closeDrawer');
    CurrentUser.logout();
  };

  getParamsForServer(params){
    throw 'Need to implement in child';
  }


  connectToServer(){
    throw 'Need to implement in child';
  }

  getPixelMandatoryParams(){
    throw 'Need to implement in child';
  }


  onServerError(){
    throw 'Need to implement in child';
  }


}

export default Base;
