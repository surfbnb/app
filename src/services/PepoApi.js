import AssignIn from 'lodash/assignIn';
import DeepGet from 'lodash/get';
import qs from 'qs';
import NetInfo from '@react-native-community/netinfo';
import Package from '../../package';
import { Platform } from 'react-native';
import Toast from '../components/NotificationToast';

// Used require to support all platforms
const RCTNetworking = require('RCTNetworking');

import Store from '../store';
import {
  hideModal,
  upsertUserEntities,
  upsertTransactionEntities,
  upsertGiffyEntities,
  upsertActivitiesEntities,
  upsertTagEntities,
  upsertUserProfileEntities,
  upsertUserStatEntities,
  upsertLinkEntities,
  upsertVideoEntities,
  upsertVideoStatEntities,
  upsertImageEntities,
  upsertHomeFeedEntities,
  upsertUserContributionEntities,
  upsertVideoContributionEntities,
  upsertUserVideoEntities,
  updatePricePoints,
  updateToken,
  upsertUserContributionByStats,
  upsertUserContributionToStats,
  upsertUserNotifications
} from '../actions';
import { API_ROOT } from '../constants/index';

import { ostErrors, UIWhitelistedErrorCode } from './OstErrors';

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

  _dispatchData(responseJSON) {
    const resultType = DeepGet(responseJSON, 'data.result_type');

    if (!resultType) {
      return;
    }
    const data = DeepGet(responseJSON, 'data'),
      resultData = DeepGet(responseJSON, `data.${resultType}`);

    if (data['ost_transaction']) {
      Store.dispatch(upsertTransactionEntities(this._getEntities(data['ost_transaction'])));
    }

    if (data['gifs']) {
      Store.dispatch(upsertGiffyEntities(this._getEntities(data['gifs'])));
    }

    if (data['tags']) {
      Store.dispatch(upsertTagEntities(this._getEntities(data['tags'])));
    }

    if (data['user_profiles']) {
      Store.dispatch(upsertUserProfileEntities(this._getEntities(data['user_profiles'])));
    }

    if (data['user_profile']) {
      Store.dispatch(upsertUserProfileEntities(this._getEntityFromObj(data['user_profile'])));
    }

    if (data['user_stats']) {
      Store.dispatch(upsertUserStatEntities(this._getEntities(data['user_stats'])));
    }

    if (data['links']) {
      Store.dispatch(upsertLinkEntities(this._getEntities(data['links'])));
    }

    if (data['videos']) {
      Store.dispatch(upsertVideoEntities(this._getEntities(data['videos'])));
    }

    if (data['video_details']) {
      Store.dispatch(upsertVideoStatEntities(this._getEntities(data['video_details'])));
    }

    if (data['images']) {
      Store.dispatch(upsertImageEntities(this._getEntities(data['images'])));
    }

    if (data['current_user_video_contributions']) {
      Store.dispatch(upsertVideoContributionEntities(this._getEntities(data['current_user_video_contributions'])));
    }

    if (data['current_user_user_contributions']) {
      Store.dispatch(upsertUserContributionEntities(this._getEntities(data['current_user_user_contributions'])));
    }

    if (data['price_points']) {
      Store.dispatch(updatePricePoints(data['price_points']));
    }

    if (data['token']) {
      Store.dispatch(updateToken(data['token']));
    }

    if (data['users']) {
      Store.dispatch(upsertUserEntities(this._getEntities(data['users'])));
    }

    if (data['contribution_to_users']) {
      Store.dispatch(upsertUserEntities(this._getEntities(data['contribution_to_users'])));
    }

    if (data['contribution_by_users']) {
      Store.dispatch(upsertUserEntities(this._getEntities(data['contribution_by_users'])));
    }

    if (data['user_contribution_to_stats']) {
      Store.dispatch(upsertUserContributionToStats(this._getEntities(data['user_contribution_to_stats'])));
    }

    if (data['user_contribution_by_stats']) {
      Store.dispatch(upsertUserContributionByStats(this._getEntities(data['user_contribution_by_stats'])));
    }

    if (data['contribution_suggestions']) {
      Store.dispatch(upsertUserEntities(this._getEntities(data['contribution_suggestions'])));
    }

    if (data['public_activity']) {
      Store.dispatch(upsertActivitiesEntities(this._getEntities(data['public_activity'])));
    }

    if (data['user_activity']) {
      Store.dispatch(upsertActivitiesEntities(this._getEntities(data['user_activity'])));
    }

    if (data['user_videos']) {
      Store.dispatch(upsertUserVideoEntities(this._getEntities(data['user_videos'])));
    }

    if (data['user_notifications']) {
      Store.dispatch(upsertUserNotifications(this._getEntities(data['user_notifications'])));
    }

    switch (resultType) {
      case 'feeds':
        Store.dispatch(upsertHomeFeedEntities(this._getEntities(resultData)));
        break;
      case 'feed':
        Store.dispatch(upsertHomeFeedEntities(this._getEntities(resultData)));
        break;
    }
  }

  _getIDList(resultData, key = 'id') {
    return resultData.map((item) => item[key]);
  }

  _getIDListFromObj(resultObj) {
    return Object.keys(resultObj);
  }

  _getEntities(entities, key = 'id') {
    if (entities instanceof Array) {
      return this._getEntitiesFromArray(entities, key);
    }
    return this._getEntitiesFromObj(entities, key);
  }

  _getEntitiesFromArray(resultData, key = 'id') {
    const entities = {};
    resultData.forEach((item) => {
      entities[`${key}_${item[key]}`] = item;
    });
    return entities;
  }

  _getEntitiesFromObj(resultObj, key = 'id') {
    const entities = {};
    for (let identifier in resultObj) {
      entities[`${key}_${identifier}`] = resultObj[identifier];
    }
    return entities;
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

        this._dispatchData(responseJSON);

        switch (responseStatus) {
          case 401:
            await CurrentUser.logout(responseJSON);
            Store.dispatch(hideModal());
            break;
          case 404:
            Store.dispatch(hideModal());
            break;
          case 500:
            Store.dispatch(hideModal());
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
