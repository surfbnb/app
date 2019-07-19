import { OstWalletSdk, OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import deepGet from 'lodash/get';
import { TOKEN_ID } from '../constants';
import {ostErrors} from "./OstErrors"; 
import {updateBalance} from "../actions";
import Store from '../store';
import PriceOracle from './PriceOracle';

let CurrentUser;
import('../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

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

  getDecimal(){
    return this.token && this.token.decimals; 
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
        isCb && successCallback && successCallback(this.pricePoints, res);
      },
      (error) => {
        isCb && errorCallback && errorCallback(error);
      }
    );
  }

  getBalance( successCallback ,  errorCallback ) {
    if( !CurrentUser.isUserActivated() ){
      errorCallback && errorCallback({"USER_NOT_ACTIVATED" : ostErrors.getUIErrorMessage("USER_NOT_ACTIVATED")}); 
      return;
    }

    OstJsonApi.getBalanceForUserId(
      CurrentUser.getOstUserId(),
      (res) => {
        let bal = deepGet(res, 'balance.available_balance');
        this.onBalance( bal );
        successCallback && successCallback( bal , res); 
      },
      (err) => {
        errorCallback && errorCallback(error);
      }
    );
  }

  onBalance(bal){
    Store.dispatch(updateBalance(bal));
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

  getBalanceWithPriceOracleConfig(ostUserId, successCallback, errorCallback) {
    this.getToken((token) => {
      this.getBalanceWithPricePoint(
        ostUserId,
        (pricePoints, bal) => {
          successCallback && successCallback(token, pricePoints, bal);
        },
        (error) => {
          errorCallback && errorCallback(error);
        }
      );
    });
  }

  getPriceOracle(){
    const pricePoint = Store.getState()["price_points"] || {}; 
    return new PriceOracle( this.token , pricePoint["OST"] );
  }

  getFromDecimal( bt ){
    return PriceOracle.fromDecimal(bt, this.getDecimal());
  }

  getToDecimal( bt ){
    return PriceOracle.toDecimal(bt, this.getDecimal());
  }
}

export default new Pricer();
