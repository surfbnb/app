import AsyncStorage from '@react-native-community/async-storage';
import AssignIn from 'lodash/assignIn';
import Store from '../store';
import { hideModal } from '../actions';

import { API_ROOT } from '../constants/index';

export default class PepoApi {
  constructor(url, params = {}) {
    this.url = url;
    this.params = params;
    this.defaultParams = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    };
    this.cleanUrl();
    this.parseParams();
  }

  cleanUrl() {
    this.cleanedUrl = this.url.startsWith('http') ? this.url : `${API_ROOT}${this.url}`;
  }

  parseParams() {
    this.parsedParams = AssignIn(this.defaultParams, this.params);
  }

  setNavigate(navigate) {
    this.navigate = navigate;
    return this;
  }

  get(body = '') {
    this.parsedParams = AssignIn(this.parsedParams, {
      method: 'GET',
      body
    });
    return this.perform();
  }

  post(body = '') {
    this.parsedParams = AssignIn(this.parsedParams, {
      method: 'POST',
      body
    });
    return this.perform();
  }

  perform() {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await fetch(this.cleanedUrl, this.parsedParams);
        let responseJSON = await response.json();
        let responseStatus = parseInt(response.status);
        console.log('Response status:', responseStatus);
        console.log('Response JSON:', responseJSON);
        if (responseStatus === 400) {
          AsyncStorage.removeItem('user', () => {
            this.navigate('AuthScreen');
          });
        } else if (responseStatus === 500) {
          responseJSON.msg = 'Something went wrong';
        }
        Store.dispatch(hideModal());
        return resolve(responseJSON);
      } catch (err) {
        console.log('Fetch exception', err);
        return reject(err);
      }
    });
  }
}
