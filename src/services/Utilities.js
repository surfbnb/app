import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import pricer from './Pricer';
import reduxGetters from './ReduxGetters';
import appConfig from '../constants/AppConfig';

import { FlyerEventEmitter } from '../components/CommonComponents/FlyerHOC';
import CurrentUser from '../models/CurrentUser';
import { LoginPopoverActions } from '../components/LoginPopover';
import { Toast } from 'native-base';
let recursiveMaxCount = 0;

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
    res = await AsyncStorage.getItem(key);
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
    if (!routes || recursiveMaxCount > 10) {
      recursiveMaxCount = 0;
      return state.routeName;
    }
    recursiveMaxCount++;
    return this.getLastChildRoutename(routes[index]);
  },

  handleVideoUploadModal(previousTabIndex , navigation) {
    if (reduxGetters.getVideoProcessingStatus() == true && previousTabIndex == 0) {
      FlyerEventEmitter.emit('onShowProfileFlyer', { id: 2 });
    } else if (reduxGetters.getVideoProcessingStatus() == true) {
      Toast.show({
        text: "Video uploading in progress."
      });
    } else {
      navigation.navigate('CaptureVideo');
    }
  },

  checkActiveUser(showPopover = true) {
    if (!CurrentUser.getOstUserId() && showPopover) {
      LoginPopoverActions.show();
      return false;
    }
    return true;
  }
};
