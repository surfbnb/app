import AssignIn from 'lodash/assignIn';
import DeepGet from 'lodash/get';
import qs from 'qs';

import Store from '../store';
import { hideModal, upsertUserEntities, upsertTransactionEntities, upsertGiffyEntities , upsertFeedEntities , addPublicFeedList ,addUserList, addUserFeedList, showToast } from '../actions';
import { API_ROOT } from '../constants/index';
import CurrentUser from '../models/CurrentUser';
import ErrorMessages from '../constants/ErrorMessages';

export default class PepoApi {
  constructor(url, params = {}) {
    this.url = url;
    this.params = params;
    this.defaultParams = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
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

  _dispatchData(responseJSON) {
    const resultType = DeepGet(responseJSON, 'data.result_type');

    if (!resultType) {
      return;
    }
    const data = DeepGet(responseJSON, 'data') ,
          resultData = DeepGet(responseJSON, `data.${resultType}`);
    switch (resultType) {
      case 'users':
        Store.dispatch(upsertUserEntities(this._getEntities(resultData)));
        Store.dispatch(addUserList(this._getIDList(resultData)));
        break;
      case 'public_feed': 
      case 'user_feed':
        Store.dispatch(upsertUserEntities(this._getEntitiesFromObj(data["users"])));
        Store.dispatch(upsertTransactionEntities(this._getEntitiesFromObj(data["ost_transaction"])));
        Store.dispatch(upsertGiffyEntities(this._getEntitiesFromObj(data["gifs"])));
        Store.dispatch(upsertFeedEntities(this._getEntities(resultData)));
        break;
    }
  }

  _getIDList(resultData, key = 'id') {
    return resultData.map((item) => item[key]);
  }

  _getIDListFromObj( resultObj ){
    return Object.keys(resultObj) ; 
  }

  _getEntities(resultData, key = 'id') {
    const entities = {};
    resultData.forEach((item) => {
      entities[`${key}_${item[key]}`] = item;
    });
    return entities;
  }

  _getEntitiesFromObj( resultObj , key="id" ){
    const entities = {};
    for( let identifier in resultObj ){
      entities[`${key}_${identifier}`] = resultObj[ identifier ];
    }
    return entities;
  }

  _perform() {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`Requesting ${this.cleanedUrl} with options:`, this.parsedParams);

        let response = await fetch(this.cleanedUrl, this.parsedParams),
          responseStatus = parseInt(response.status),
          responseJSON = await response.json();

        this._dispatchData(responseJSON);

        console.log(`Response status ${responseStatus} for ${this.cleanedUrl} with JSON payload:`, responseJSON);

        if (responseStatus >= 400 && responseStatus < 500) {
          CurrentUser.logout(responseJSON);
          Store.dispatch(hideModal());
        } else if (responseStatus >= 500) {
          Store.dispatch(showToast(ErrorMessages.general_error));
        }

        return resolve(responseJSON);
      } catch (err) {
        console.log('Fetch exception', err);
        return reject(err);
      }
    });
  }
}
