import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import PriceOracle from '../../services/PriceOracle';
import currentUserModal from '../../models/CurrentUser';
import { OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import deepGet from 'lodash/get';
import pricer from '../../services/Pricer';
import inlineStyles from './styles';
import utilities from '../../services/Utilities';

class BalanceHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balInBt: 0,
      balInUsd: 0
    };
    this.priceOracle = null;
    this.fetching = false;
    this.fetchBalance();
  }

  componentWillReceiveProps() {
    if (!!this.props.toRefresh) {
      this.fetchBalance();
    }
  }

  fetchBalance() {
    if (this.fetching) return;
    this.fetching = true;
    this.updatePricePoint();
  }

  updatePricePoint() {
    const ostUserId = currentUserModal.getOstUserId();
    pricer.getPriceOracleConfig(
      ostUserId,
      (token, pricePoints) => {
        this.getBalance(token, pricePoints);
      },
      (error) => {
        this.fetching = false;
      }
    );
  }

  getBalance(token, pricePoints) {
    if (!currentUserModal.isUserActivated()) {
      this.fetching = false;
      return;
    }

    this.priceOracle = new PriceOracle(token, pricePoints);
    if (!this.priceOracle) {
      this.fetching = false;
      return;
    }

    const ostUserId = currentUserModal.getOstUserId();
    OstJsonApi.getBalanceForUserId(
      ostUserId,
      (res) => {
        this.fetching = false;
        this.updateBalance(res);
      },
      (err) => {
        this.fetching = false;
      }
    );
  }

  updateBalance(res) {
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
          <Text style={inlineStyles.pepoBalance}>
            <Image style={{ width: 25, height: 22 }} source={utilities.getTokenSymbolImageConfig()['image2']}></Image>{' '}
            {this.state.balInBt}
          </Text>
          <Text style={inlineStyles.usdBalance}>$ {this.state.balInUsd} </Text>
        </View>
      </View>
    );
  }
}

export default BalanceHeader;
