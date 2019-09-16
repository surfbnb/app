import deepGet from "lodash/get";
import CurrentUser from '../models/CurrentUser';
import NavigationService from '../services/NavigationService';

class NavigateTo {
  constructor(  ) {
    this.navigation = null;
    this.goTo = null;
  }

  navigate(goToObject, navigation, payload ) {
    goToObject = goToObject || {};
    if( navigation ){
      this.navigation = navigation;
    }
    if (goToObject && goToObject.pn == 'p') {
      this.goToProfilePage(goToObject.v.puid, payload);
    } else if (goToObject && goToObject.pn == 'cb') {
      this.goToSupporters(goToObject.v.puid, payload);
    } else if (goToObject && goToObject.pn == 'v') {
      this.goToVideo(goToObject.v.vid, payload);
    } else if (goToObject && goToObject.pn == 'f') {
      this.__navigate('Home', { payload: payload });
    } else if (goToObject && goToObject.pn == 'nc') {
      this.__navigate('Notification', { payload: payload });
    } else if (goToObject.pn == 'e') {
      this.__push('AddEmailScreen', { payload: payload });
    }
  }

  goToVideo = (vId, payload) => {
    this.__push('VideoPlayer', {
      videoId: vId,
      payload: payload
    });
  };

  goToSupporters = (profileId, payload) => {
    this.__push('SupportersListScreen', { userId: profileId, payload: payload });
  };

  goToProfilePage = (id, payload) => {
    if (id == CurrentUser.getUserId()) {
      this.__navigate('ProfileScreen', { payload: payload });
    } else {
      this.__push('UsersProfileScreen', { userId: id, payload: payload });
    }
  };

  handleGoTo(res, navigation ,  payload) {
    if(!res) return;
    let isGoto = !!deepGet(res, 'data.go_to.pn');
    if (isGoto) {
      //Just to avoid goback conflict, excequte last.
      setTimeout(() => {
        this.navigate(res.data.go_to , navigation , payload);
      }, 0);
      return true;
    }
    return false;
  };

  navigationDecision(noFallBack) {
    if (CurrentUser.getUser() && !CurrentUser.isActiveUser()) {
      this.__navigate("UserActivatingScreen");
    }else if(this.__isGoto()){
      this.navigate(this.getGoTo());
      this.clearGoTo();
    }
    else {
      !noFallBack && this.__navigate("HomeScreen");
    }
  }

  __navigate(screenName ,  payload ){
    if(!screenName) return ;
    if(this.navigation){
      this.navigation.navigate(screenName, { payload: payload });
    }else{
      NavigationService.navigate(screenName, { payload: payload });
    }
  }

  __push(screenName , payload){
    if(!screenName) return ;
    if(this.navigation){
      this.navigation.navigate(screenName, { payload: payload });
    }else{
      NavigationService.push(screenName, { payload: payload });
    }
  }

  setGoTo( goTo ){
    this.goTo =  goTo;
  }

  getGoTo(){
    return this.goTo ;
  }

  clearGoTo(){
    this.goTo = null;
  }

  __isGoto(){
    return this.goTo && Object.keys( this.goTo ).length > 0 ;
  }

}

const navigateTo = new NavigateTo();

export { navigateTo }
