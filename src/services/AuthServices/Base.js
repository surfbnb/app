import deepGet from 'lodash/get';
import assignIn from 'lodash/assignIn';
import { upsertInviteCode } from '../../actions';
import Store from '../../store';
import {LoginPopoverActions} from '../../components/LoginPopover';
import AppConfig from '../../constants/AppConfig';
import { navigateTo } from '../../helpers/navigateTo';
import Pricer from '../Pricer';
import DataContract from '../../constants/DataContract';
import PixelCall from '../PixelCall';
import {DrawerEmitter} from "../../helpers/Emitters";

let CurrentUser;
import('../../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

let Utilities;
import('../Utilities').then((imports) => {
  Utilities = imports.default;
});

class Base {

  constructor(){}

  async signUp(paramsFromService) {
    let params = this.getParamsForServer(paramsFromService);
    if (params && Object.keys(params).length > 0) {
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
          console.log("success finally")
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
    return {
      e_entity: "user",
      e_action: "registration",
      p_type: "signin"
    };
  }

  onServerError(){
    throw 'Need to implement in child';
  }


}

export default Base;
