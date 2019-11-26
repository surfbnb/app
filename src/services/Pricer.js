import { OstJsonApi, OstWalletSdk} from '@ostdotcom/ost-wallet-sdk-react-native';
import deepGet from 'lodash/get';
import {updateBalance} from "../actions";
import Store from '../store';
import PriceOracle from './PriceOracle';
import ReduxGetter from "./ReduxGetters";
import numeral from "numeral";
import OstWalletSdkHelper from '../helpers/OstWalletSdkHelper';
import PepoApi from './PepoApi';
import DataContract from '../constants/DataContract';
import BigNumber from 'bignumber.js';

let CurrentUser;
import('../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

let ostErrors;
import('./OstErrors').then((imports) => {
  ostErrors = imports.ostErrors;
});

let ostSdkErrors, DEFAULT_CONTEXT;
import('./OstSdkErrors').then((imports) => {
  ostSdkErrors = imports.ostSdkErrors;
  DEFAULT_CONTEXT = imports.DEFAULT_CONTEXT;
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

    OstWalletSdk.getCurrentDeviceForUserId(CurrentUser.getOstUserId(), ( device )=> {
      if( !OstWalletSdkHelper.canDeviceMakeApiCall( device ) ) {
        successCallback && successCallback(0);
        return;
      }
      OstJsonApi.getBalanceForUserId(
        CurrentUser.getOstUserId(),
        (res) => {
          let bal = deepGet(res, 'balance.available_balance');
          this.onBalance( bal );
          successCallback && successCallback( bal , res);
        },
        (ostErrorJson) => {
          let ostError =  OstWalletSdkHelper.jsonToOstRNError(ostErrorJson);
          let errMsg = ostSdkErrors.getErrorMessage(DEFAULT_CONTEXT, ostError);
          errorCallback && errorCallback(ostError, DEFAULT_CONTEXT);
        }
      );
    });
  }

  onBalance(bal){
    Store.dispatch(updateBalance(bal));
  }

  getPriceOracle() {
    const pricePoint = ReduxGetter.getPricePoint();
    const token = ReduxGetter.getToken();
    return new PriceOracle( token  , pricePoint &&  pricePoint["OST"] );
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
    if(amount <= 0.0000001 ){
      amount = parseInt(amount);
      amount  = amount.toFixed(2);
    }
    return numeral(amount).format('0[.]00a') || 0;
  }

  displayAmountWithKFomatter( amount ){
    if(isNaN( amount )) return amount;
    if( amount < 10000 ){
      return numeral( amount ).format('0', Math.floor);
    } else {
      return numeral( amount ).format('0a+', Math.floor)
    }
  }

  getWeiToNumber = ( val ) => { 
    return val && Math.floor(Number(this.getFromDecimal(val))) || 0;
  } ;

  getBtFromPepoCornsInWei( pepoCorns , step , pepoInWeiPerStep){
    if(!pepoCorns || !step || !pepoInWeiPerStep ) return "0";
    let pepoInEthPerStep =  this.getFromDecimal(pepoInWeiPerStep); //Normalize to ETH
    let pepoInEthPerStepBN = BigNumber( pepoInEthPerStep ); //Convert to BN 
    let amountBn = BigNumber(pepoCorns).dividedBy(step) ;  //Get amount in BN
    amountBn = pepoInEthPerStepBN.multipliedBy(amountBn).toString(10); //Get pepo in ETH
    amountBn = this.getToDecimal( amountBn ); // Convert to WEI
    return BigNumber(amountBn).toFixed(); // Ignore decimal places if any
  }

  getBtFromPepoCornsEth( pepoCorns , step , pepoInWeiPerStep  ){
    pepoCorns = this.getBtFromPepoCornsInWei( pepoCorns , step , pepoInWeiPerStep  );
    return this.getFromDecimal( pepoCorns );
  }

  getBtFromPepoCorns( pepoCorns , step , pepoInWeiPerStep , precession ){
    pepoCorns = this.getBtFromPepoCornsEth( pepoCorns , step , pepoInWeiPerStep  );
    return this.getToBT( pepoCorns , precession )
  }

  isValidPepocornStep( val ,  step ){
    if(!val || !step) return true;
    let valBN = BigNumber( val );
    let remainder =  valBN.modulo(step);
    remainder =  remainder && Number(remainder)
    if( remainder == 0){
      return true;
    }else{
      return false;
    }
  }

  fetchPepocornsBalance(){
    return new PepoApi(DataContract.redemption.fetchPepoCornsBalanceApi)
    .get()
    .catch((error)=> {
      //Silent Ignore
    })
  }

}

export default new Pricer();
