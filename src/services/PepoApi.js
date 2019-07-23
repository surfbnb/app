import AssignIn from 'lodash/assignIn';
import DeepGet from 'lodash/get';
import qs from 'qs';
import NetInfo from '@react-native-community/netinfo';
import Package from '../../package';
import { Platform } from 'react-native';
import { Toast } from 'native-base';

import Store from '../store';
import {
  hideModal,
  upsertUserEntities,
  upsertTransactionEntities,
  upsertGiffyEntities,
  upsertFeedEntities,
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
  updatePricePoints,
  updateCurrentUser
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

    if( data['ost_transaction'] ){
      Store.dispatch(upsertTransactionEntities(this._getEntitiesFromObj(data['ost_transaction'])));
    }

    if( data['gifs'] ){
      Store.dispatch(upsertGiffyEntities(this._getEntitiesFromObj(data['gifs'])));
    }
    
    if( data['tags'] ){
      Store.dispatch(upsertTagEntities(this._getEntitiesFromObj(data['tags'])));
    }

    if( data['user_profiles'] ){
      Store.dispatch(upsertUserProfileEntities(this._getEntitiesFromObj(data['user_profiles'])));
    }

    if( data['user_profile'] ){
      Store.dispatch(upsertUserProfileEntities(this._getEntityFromObj(data['user_profile'])));
    }

    if( data['user_stats'] ){
      Store.dispatch(upsertUserStatEntities(this._getEntitiesFromObj(data['user_stats'])));
    }
    
    if( data['links'] ){
      Store.dispatch(upsertLinkEntities(this._getEntitiesFromObj(data['links'])));
    }

    if( data['videos'] ){
      Store.dispatch(upsertVideoEntities(this._getEntitiesFromObj(data['videos'])));
    }
   
    if( data['video_details'] ){
      Store.dispatch(upsertVideoStatEntities(this._getEntitiesFromObj(data['video_details'])));
    }
    
    if( data['images'] ){
      Store.dispatch(upsertImageEntities(this._getEntitiesFromObj(data['images'])));
    }

    if( data["current_user_video_contributions"] ){
      Store.dispatch(upsertVideoContributionEntities(this._getEntitiesFromObj(data['current_user_video_contributions'])));
    }

    if( data["current_user_user_contributions"] ){
      Store.dispatch(upsertUserContributionEntities(this._getEntitiesFromObj(data['current_user_user_contributions'])));
    }

    if( data["price_points"] ){
      Store.dispatch(updatePricePoints( data["price_points"] ));
    }

    if( data['users'] ){
      Store.dispatch(upsertUserEntities(this._getEntitiesFromObj(data['users'])));
    }

    switch (resultType) {
      case 'feeds': 
          Store.dispatch(upsertHomeFeedEntities(this._getEntities(resultData)));
        break;
      case "feed":
          Store.dispatch(upsertHomeFeedEntities(this._getEntitiesFromObj(resultData)));
        break;  
    }
  }

  _getIDList(resultData, key = 'id') {
    return resultData.map((item) => item[key]);
  }

  _getIDListFromObj(resultObj) {
    return Object.keys(resultObj);
  }

  _getEntities(resultData, key = 'id') {
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

  _getEntityFromObj( resultObj , key = "id" ){
    const entity = {} ,  id = `${key}_${resultObj.id}` ;
    entity[ id ] = resultObj ;
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
            buttonText: 'Okay'
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
            CurrentUser.logout(responseJSON);
            Store.dispatch(hideModal());
            break;
          case 404:
            Store.dispatch(hideModal());
            break;
          case 500:
            Store.dispatch(hideModal());
            Toast.show({
              text: ostErrors.getUIErrorMessage('general_error'),
              buttonText: 'Okay'
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
