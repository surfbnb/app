import React from 'react';
import { connect } from 'react-redux';

import CurrentUser from '../../models/CurrentUser';
import Pricer from '../../services/Pricer';
import WalletSetupFlyer from '../WalletSetupFlyer';
import WalletBalanceFlyer from '../WalletBalanceFlyer';
import Colors from '../../theme/styles/Colors';

const mapStateToProps = (state) => ({ balance: state.balance });

const getBalance = (props) => {
  return Pricer.getToBT(Pricer.getFromDecimal(props.balance), 2) || 0;
};

const TopStatus = (props) => {
  return (
    CurrentUser.getUserId() &&
    (props.balance == null ? (
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
      <WalletBalanceFlyer balance={getBalance(props)} id={2} />
    ))
  );
};

export default connect(mapStateToProps)(TopStatus);
