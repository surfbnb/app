import AssignIn from 'lodash/assignIn';
import qs from 'qs';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Toast from '../theme/components/NotificationToast';
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
        'User-Agent': DeviceInfo.getUserAgent(),
        'X-PEPO-DEVICE-OS': Platform.OS,
        'X-PEPO-DEVICE-OS-VERSION': DeviceInfo.getSystemVersion(),
        'X-PEPO-DEVICE-ID': DeviceInfo.getUniqueID(),
        'X-PEPO-BUILD-NUMBER': DeviceInfo.getBuildNumber(),
        'X-PEPO-APP-VERSION': DeviceInfo.getVersion()
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
          case 404:
          case 409:
            break;
          case 401:
            await CurrentUser.logout({device_id: DeviceInfo.getUniqueID()});
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
