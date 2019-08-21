import AssignIn from 'lodash/assignIn';
import DeepGet from 'lodash/get';
import qs from 'qs';
import NetInfo from '@react-native-community/netinfo';
import Package from '../../package';
import { Platform } from 'react-native';
import Toast from '../components/NotificationToast';

// Used require to support all platforms
const RCTNetworking = require('RCTNetworking');

import { API_ROOT } from '../constants/index';

import { ostErrors, UIWhitelistedErrorCode } from './OstErrors';
import dispatchEntities from '../services/ReduxSetters';

let CurrentUser;
import('../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

export default class PepoApi {
  constructor(url, params = {}) {
    this.url = url;
    this.params = params;
    this.defaultParams = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': this._getUserAgent()
      }
    };
    this._cleanUrl();
    this._parseParams();
  }

  get(q = '') {
    let query = typeof q !== 'string' ? qs.stringify(q) : q;
    this.parsedParams = AssignIn(this.parsedParams, {
      method: 'GET'
    });
    this.cleanedUrl += query.length > 0 ? (this.cleanedUrl.indexOf('?') > -1 ? `&${query}` : `?${query}`) : '';

    return this._perform();
  }

  post(body = '') {
    body = typeof body !== 'string' ? JSON.stringify(body) : body;
    this.parsedParams = AssignIn(this.parsedParams, {
      method: 'POST',
      body
    });
    return this._perform();
  }

  _cleanUrl() {
    this.cleanedUrl = this.url.startsWith('http') ? this.url : `${API_ROOT}${this.url}`;
  }

  _parseParams() {
    this.parsedParams = AssignIn(this.defaultParams, this.params);
  }

  _getUserAgent() {
    let name = Package.name,
      appVersion = Package.version,
      rnVersion = Package.dependencies['react-native'],
      os = Platform.OS,
      osVersion = Platform.Version,
      envDev = __DEV__ === true;
    return `${os} ${osVersion}; RN ${rnVersion}; ${name} ${appVersion}; envDev ${envDev}`;
  }

  _getIDList(resultData, key = 'id') {
    return resultData.map((item) => item[key]);
  }

  _getIDListFromObj(resultObj) {
    return Object.keys(resultObj);
  }

  _getEntityFromObj(resultObj, key = 'id') {
    const entity = {},
      id = `${key}_${resultObj.id}`;
    entity[id] = resultObj;
    return entity;
  }

  _perform() {
    return new Promise(async (resolve, reject) => {
      try {
        let netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          console.log(`Error requesting ${this.cleanedUrl}. ${ostErrors.getUIErrorMessage('no_internet')}`);
          Toast.show({
            text: ostErrors.getUIErrorMessage('no_internet'),
            icon: 'error'
          });

          // Cosider using reject here.
          throw UIWhitelistedErrorCode['no_internet'];
        }

        let t1 = Date.now();
        console.log(`Requesting ${this.cleanedUrl} with options:`, this.parsedParams);

        let response = await fetch(this.cleanedUrl, this.parsedParams),
          responseStatus = parseInt(response.status),
          responseJSON = await response.json();

        let t2 = Date.now();
        console.log(
          `Response for ${this.cleanedUrl} resolved in ${t2 - t1} ms, Status: ${responseStatus}, JSON payload:`,
          responseJSON
        );

        dispatchEntities(responseJSON.data);

        switch (responseStatus) {
          case 200:
          case 301:
          case 302:
          case 304:
          case 400:
          case 409:
            break;
          case 401:
            await CurrentUser.logout(responseJSON);
            break;
          default:
            Toast.show({
              text: ostErrors.getUIErrorMessage('general_error'),
              icon: 'error'
            });
            break;
        }

        return resolve(responseJSON);
      } catch (err) {
        console.log('Fetch exception', err);
        return reject(err);
      }
    });
  }
}
