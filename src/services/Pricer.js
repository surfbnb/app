import { OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import deepGet from 'lodash/get';
import {ostErrors} from "./OstErrors"; 
import {updateBalance} from "../actions";
import Store from '../store';
import PriceOracle from './PriceOracle';
import ReduxGetter from "./ReduxGetters";
import numeral from "numeral";

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

  getDecimal(){
    const token = ReduxGetter.getToken() || {};
    return token.decimal;  
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
      (error) => {
        errorCallback && errorCallback(error);
      }
    );
  }

  onBalance(bal){
    Store.dispatch(updateBalance(bal));
  }

  getPriceOracle() {
    const pricePoint = ReduxGetter.getPricePoint(); 
    const token = ReduxGetter.getToken(); 
    return new PriceOracle( token  , pricePoint["OST"] );
  }

  getFromDecimal( bt ){
    return PriceOracle.fromDecimal(bt, this.getDecimal());
  }

  getToDecimal( bt ){
    return PriceOracle.toDecimal(bt, this.getDecimal());
  }

  getToBT( bt , precession ){
    return PriceOracle.toBt(bt, precession);
  }

  toDisplayAmount(amount) {
    if(isNaN(amount)) return amount;
    return numeral(amount).format('0[.]00a') || 0;
  }

}

export default new Pricer();
