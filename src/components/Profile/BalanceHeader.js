import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PriceOracle from '../../services/PriceOracle';
import currentUserModal from '../../models/CurrentUser';
import {  OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import deepGet from 'lodash/get';
import pricer from "../../services/Pricer";

import inlineStyles from './styles';
class BalanceHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balInBt: 0,
      balInUsd: 0
    };
    this.fetching = false;
    this.isRetryUpdatePricePoint = false;
    this.priceOracle = null;
    this.updatePricePoint();
  }

  componentWillReceiveProps() {
    if (!!this.props.toRefresh) {
      this.getBalance();
    }
  }

  updatePricePoint() {
    const ostUserId = currentUserModal.getOstUserId();
    if (!currentUserModal.isUserActivated()) {
      return;
    }
    pricer.getPriceOracleConfig( ostUserId , (token, pricePoints)=>{
      this.initPriceOracle(token, pricePoints);
      this.getBalance();
    }, (error)=>{
      //DO nothing. 
    }); 
  }

  initPriceOracle(token, pricePoints) {
    this.priceOracle = new PriceOracle( token, pricePoints );
  }

  getBalance() {
    if (this.fetching) {
      return;
    }
    if (!this.priceOracle && !this.isRetryUpdatePricePoint) {
      this.isRetryUpdatePricePoint = true;
      this.updatePricePoint();
      return;
    }
    this.isRetryUpdatePricePoint = false;
    this.fetching = true;
    const ostUserId = currentUserModal.getOstUserId();
    OstJsonApi.getBalanceForUserId(
      ostUserId,
      (res) => {
        this.updateBalance(res);
      },
      (err) => {
        this.fetching = false;
      }
    );
  }

  updateBalance(res) {
    if(!this.priceOracle) return;
    this.fetching = false;
    let btBalance = deepGet(res, 'balance.available_balance');
    btBalance = this.priceOracle.fromDecimal(btBalance);
    btBalance = this.priceOracle.toBt(btBalance);
    let usdBalance = this.priceOracle.btToFiat(btBalance);
    this.setState({ balInBt: btBalance, balInUsd: usdBalance });
  }

  render() {
    return (
      <View style={inlineStyles.balanceHeaderContainer}>
        <View style={inlineStyles.balanceHeader}>
          <Text style={inlineStyles.balanceToptext}>Your Balance</Text>
          <Text style={inlineStyles.pepoBalance}>P {this.state.balInBt}</Text>
          <Text style={inlineStyles.usdBalance}>$ {this.state.balInUsd} </Text>
        </View>
      </View>
    );
  }
}

export default BalanceHeader;
