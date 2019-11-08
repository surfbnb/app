import AsyncStorage from '@react-native-community/async-storage';
import { Alert, Platform, Linking } from 'react-native';
import deepGet from 'lodash/get';

import pricer from './Pricer';
import reduxGetters from './ReduxGetters';
import appConfig from '../constants/AppConfig';

import { FlyerEventEmitter } from '../components/CommonComponents/FlyerHOC';
import { LoginPopoverActions } from '../components/LoginPopover';
import Toast from '../theme/components/NotificationToast';
import CameraPermissionsApi from '../services/CameraPermissionsApi';
import { allowAcessModalEventEmitter } from '../components/AllowAccessModalScreen';
import AppConfig from '../constants/AppConfig';
import PepoApi from './PepoApi';
import DataContract from '../constants/DataContract';

let CurrentUser;
import('../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

let os = Platform.OS || "";
os =  os.toLowerCase();

let recursiveMaxCount = 0;

let checkVideoPermission = function(navigation, params ) {
  CameraPermissionsApi.requestPermission('camera').then((cameraResult) => {
    CameraPermissionsApi.requestPermission('microphone').then((microphoneResult) => {
      if (cameraResult == 'authorized' && microphoneResult == 'authorized') {
        console.log('checkVideoPermission:cameraResult', cameraResult);
        console.log('checkVideoPermission:microphoneResult', microphoneResult);
        navigation.navigate('CaptureVideo', params);
      } else if (
        (Platform.OS == 'ios' && (cameraResult == 'denied' || microphoneResult == 'denied')) ||
        cameraResult == 'restricted' ||
        microphoneResult == 'restricted'
      ) {
        let accessText = '';
        if ((cameraResult == 'denied' || cameraResult == 'restricted') && microphoneResult == 'authorized') {
          accessText = 'Enable Camera Access';
        } else if ((microphoneResult == 'denied' || microphoneResult == 'restricted') && cameraResult == 'authorized') {
          accessText = 'Enable Microphone Access';
        } else {
          accessText = 'Enable Camera and Microphone Access';
        }
        allowAcessModalEventEmitter.emit('show', accessText);
      }
    });
  });
};

export default {
  async saveItem(key, val) {
    try {
      if (typeof val == 'object') {
        val = JSON.stringify(val);
      } else {
        val = String(val);
      }
      await AsyncStorage.removeItem(key);
      await AsyncStorage.setItem(key, val);
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
    }
  },

  removeItem(key) {
    return AsyncStorage.removeItem(key);
  },

  async getItem(key) {
    return AsyncStorage.getItem(key);
  },

  showAlert(title, message) {
    title = title || '';
    if (!message) return;
    setTimeout(() => {
      Alert.alert(title, message);
    }, 10);
  },

  getTokenSymbolImageConfig() {
    let symbol = pricer.getTokenSymbol();
    return appConfig['tokenSymbols'][symbol];
  },

  _getIDList(resultData, key = 'id') {
    return resultData.map((item) => item[key]);
  },

  _getIDListFromObj(resultObj) {
    return Object.keys(resultObj);
  },

  _getEntities(resultData, key = 'id') {
    const entities = {};
    resultData.forEach((item) => {
      entities[`${key}_${item[key]}`] = item;
    });
    return entities;
  },

  _getEntitiesFromObj(resultObj, key = 'id') {
    const entities = {};
    for (let identifier in resultObj) {
      entities[`${key}_${identifier}`] = resultObj[identifier];
    }
    return entities;
  },

  _getEntityFromObj(resultObj, key = 'id') {
    const entity = {},
      id = `${key}_${resultObj.id}`;
    entity[id] = resultObj;
    return entity;
  },

  isUserActivated(status) {
    status = status || '';
    return status.toLowerCase() == appConfig.userStatusMap.activated;
  },

  getLastChildRoutename(state) {
    if (!state) return null;
    let index = state.index,
      routes = state.routes;
    if (!routes || recursiveMaxCount > 50) {
      recursiveMaxCount = 0;
      return state.routeName;
    }
    recursiveMaxCount++;
    return this.getLastChildRoutename(routes[index]);
  },

  getActiveTab( navigation ){
    if( !navigation ) return ;
    let activeIndex = deepGet(navigation , 'state.index'),
        route = deepGet(navigation , `state.routes[${activeIndex}]`);
    return route && route["routeName"];
  },

  handleVideoUploadModal(previousTabIndex, navigation, params = {}) {
    if (reduxGetters.getVideoProcessingStatus() == true && previousTabIndex == 0) {
      // TODO: check if video or reply and accordingly emit corresponding event.
      FlyerEventEmitter.emit('onShowProfileFlyer', { id: 2 });
    } else if (reduxGetters.getVideoProcessingStatus() == true) {
      Toast.show({
        text: 'Video uploading in progress.'
      });
    } else {
      checkVideoPermission(navigation, params);
    }
  },

  checkActiveUser(showPopover = true) {
    if (!CurrentUser.getOstUserId() && showPopover) {
      LoginPopoverActions.show();
      return false;
    }
    return true;
  },

  getParsedData( val ){
    if( typeof val == "string"){
        try{
          val = JSON.parse( val );
        }catch(error){}
    }
    return val = val || {};
  },

  sanitizeLink(link) {
    return link
      .split('/')
      .map((item, index) => (index < 3 ? item.toLowerCase() : item))
      .join('/');
  },

  isEntityDeleted (res){
    let status = deepGet(res ,  "err.code") || "";
    return status.toLowerCase() == AppConfig.beKnownErrorCodeMaps.entityDeleted ;
  },

  getNativeStoreName(){
    return deepGet(AppConfig.nativeStoreMap , `${os}.storeName` , "store");
  },

  getSingularPluralText( val = 0 , text = "" ){
    if(!text) return text ;
    val =  Number( val );
    if( val > 1  ){
      return text+"s" ;
    }
    return text ;
  },

  openRedemptionWebView() {
    new PepoApi(DataContract.redemption.openRedemptionWebViewApi)
    .get()
    .then((res) => {
      let url =  deepGet(res, "data.redemption_info.url");
      url && Linking.openURL(url);
    })
    .catch((error) => {});
  },

  getPepoCornsName(noOfPepoCorns){
    const pepocornsName = AppConfig.redemption.pepoCornsName,
    length              = pepocornsName.length;
    if(noOfPepoCorns && noOfPepoCorns <= 1){
      return pepocornsName.substring(0, length - 1);
    }
    return pepocornsName;
  }

};
