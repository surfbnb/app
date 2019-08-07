import React from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';

import inlineStyles from './styles';
import selfAmountWallet from '../../assets/self-amount-wallet.png';
import CurrentUser from '../../models/CurrentUser';
import Pricer from '../../services/Pricer';
import WalletSetupFlyer from '../WalletSetupFlyer';

const mapStateToProps = (state) => ({ balance: state.balance });

const getBalance = (props) => {
  return Pricer.getToBT(Pricer.getFromDecimal(props.balance), 2) || 0;
};

const TopStatus = (props) => {
  return (
    CurrentUser.getUserId() &&
    (getBalance(props) == null ? (
      <WalletSetupFlyer
        componentHeight={46}
        componentWidth={46}
        sliderWidth={250}
        containerStyle={{ top: 50, right: 10 }}
        displayText="Initializing wallet please wait..."
        extendDirection="left"
        extend={true}
        id={1}
      />

    ) : (
      <View style={inlineStyles.topContainer}>
        <View style={inlineStyles.topBg}>
          <Image style={[{ height: 11.55, width: 11.55 }]} source={selfAmountWallet} />
          <Text style={[inlineStyles.topBgTxt]}>{getBalance(props)}</Text>
        </View>
      </View>
    ))
  );
};

export default connect(mapStateToProps)(TopStatus);