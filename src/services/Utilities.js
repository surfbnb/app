import AsyncStorage from '@react-native-community/async-storage';
import { Alert, Platform, Linking , Dimensions } from 'react-native';
import deepGet from 'lodash/get';

import pricer from './Pricer';
import reduxGetters from './ReduxGetters';

import { FlyerEventEmitter } from '../components/CommonComponents/FlyerHOC';
import { LoginPopoverActions } from '../components/LoginPopover';
import Toast from '../theme/components/NotificationToast';
import CameraPermissionsApi from '../services/CameraPermissionsApi';
import { allowAcessModalEventEmitter } from '../components/AllowAccessModalScreen';
import AppConfig from '../constants/AppConfig';;
import DataContract from '../constants/DataContract';
import { isIphoneX } from 'react-native-iphone-x-helper';
import * as RNLocalize from "react-native-localize";
import momentTimezone from 'moment-timezone';
import NavigationService from './NavigationService';

let CurrentUser, PepoApi;
import('../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});
import('./PepoApi').then((imports) => {
  PepoApi = imports.default;
});

let os = Platform.OS || "";
os =  os.toLowerCase();

let recursiveMaxCount = 0;

let checkVideoPermission = function(navigation, params ) {
  CameraPermissionsApi.requestPermission('camera').then((cameraResult) => {
    CameraPermissionsApi.requestPermission('microphone').then((microphoneResult) => {
      if (cameraResult == AppConfig.permisssionStatusMap.granted && microphoneResult == AppConfig.permisssionStatusMap.granted) {
        console.log('checkVideoPermission:cameraResult', cameraResult);
        console.log('checkVideoPermission:microphoneResult', microphoneResult);
        navigation.navigate('CaptureVideo', params);
      } else if ( cameraResult == AppConfig.permisssionStatusMap.denied || microphoneResult == AppConfig.permisssionStatusMap.denied
         || cameraResult == AppConfig.permisssionStatusMap.blocked  || microphoneResult ==  AppConfig.permisssionStatusMap.blocked
      ) {
        let accessText = '';
        if ((cameraResult == AppConfig.permisssionStatusMap.denied || cameraResult ==  AppConfig.permisssionStatusMap.blocked ) && microphoneResult == AppConfig.permisssionStatusMap.granted) {
          accessText = 'Enable Camera Access';
        } else if ((microphoneResult ==  AppConfig.permisssionStatusMap.denied || microphoneResult == AppConfig.permisssionStatusMap.blocked) && cameraResult == AppConfig.permisssionStatusMap.granted) {
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
    return AppConfig['tokenSymbols'][symbol];
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
    return status.toLowerCase() == AppConfig.userStatusMap.activated;
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
    //todo: @mayur toast and flyer logic change.
    if (reduxGetters.getVideoProcessingStatus()  && previousTabIndex == 0) {
      FlyerEventEmitter.emit('onShowProfileFlyer', { id: 2 });
    } else if (reduxGetters.getVideoProcessingStatus()) {
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
  },

  getPendantAvailableHeight(){
    const area = AppConfig.MaxDescriptionArea;
    let height = ( area / Dimensions.get('window').width ) + 20;
      //70 is height of top section
    return AppConfig.VideoScreenObject.height - height - (isIphoneX ? 78 : Platform.OS === 'ios' ? 28 : 80) ;
  } ,

  getPendantTop(){
    if( isIphoneX ){
      return 60 + 45; 
    }else{
      return 30+45;
    }
  },

  getLanguageTag() {
    const locales = RNLocalize.getLocales() || [] ,
    local = locales[0] || {}
    ;
    return local["languageTag"];
  },

  getUTCTimeZone(){
    return RNLocalize.getTimeZone();
  },
  
  getNumbericUTCTimeZone(){
    return momentTimezone.tz(this.getUTCTimeZone()).utcOffset();
  },

  capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  },

  formDataToJSON(formData) {
    var object = {};
    for (let p in formData){
        formData[p].forEach((item)=> {
            object[item[0]] = item[1]
        });
    }
    return object;
  },

  isIos(){
    return Platform.OS === "ios" ;
  },

  isAndroid(){
    return Platform.OS === "android";
  },

  isChannelPage(state) {
    return this.getLastChildRoutename(state) == AppConfig.channelConstants.SCREEN_NAME;
  },

  isCameraScreen() {
    return AppConfig.cameraScreens.includes(NavigationService.findCurrentRoute());
  }

};
