import { OstWalletSdk, OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import deepGet from 'lodash/get';
import { TOKEN_ID } from '../constants';

class Pricer {
  constructor() {
    this.token = null;
    this.pricePoints = null;
  }

  getTokenSymbol() {
    let symbol = deepGet(this.token, 'symbol') || 'PEPO';
    return symbol.toLowerCase();
  }

  getToken(successCallback) {
    if (this.token) {
      successCallback && successCallback(this.token);
      return;
    }
    OstWalletSdk.getToken(TOKEN_ID, (token) => {
      this.token = token;
      successCallback && successCallback(token);
    });
  }

  getPricePoints(ostUserId, successCallback, errorCallback) {
    let isCb = true;
    if (!ostUserId) {
      errorCallback &&
        errorCallback({
          success: false,
          msg: 'No user found'
        });
      return;
    }
    if (this.pricePoints) {
      successCallback && successCallback(this.pricePoints);
      isCb = false;
    }
    OstJsonApi.getPricePointForUserId(
      ostUserId,
      (res) => {
        this.pricePoints = deepGet(res, 'price_point.OST');
        isCb && successCallback && successCallback(this.pricePoints);
      },
      (error) => {
        isCb && errorCallback && errorCallback(error);
      }
    );
  }

  getPriceOracleConfig(ostUserId, successCallback, errorCallback) {
    this.getToken((token) => {
      this.getPricePoints(
        ostUserId,
        (pricePoints) => {
          successCallback && successCallback(token, pricePoints);
        },
        (error) => {
          errorCallback && errorCallback(error);
        }
      );
    });
  }
}

export default new Pricer();
