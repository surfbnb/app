import React from 'react';
import { connect } from 'react-redux';

import CurrentUser from '../../models/CurrentUser';
import WalletSetupFlyer from '../WalletSetupFlyer';
import WalletBalanceFlyer from '../WalletBalanceFlyer';
import {ifIphoneX} from "react-native-iphone-x-helper";

const mapStateToProps = (state) => ({
  balance: state.balance,
  current_user_ost_status: CurrentUser.__getUserStatus()
});

const TopStatus = (props) => {
  return (
    CurrentUser.getUserId() &&
    (!CurrentUser.isUserActivated() && props.balance == null ? (
      <WalletSetupFlyer
        componentHeight={46}
        componentWidth={46}
        sliderWidth={250}
        containerStyle=
          {{
            ...ifIphoneX({
              top: 60,
            }, {
              top: 30,
            }),
            right: 10
          }}
        displayText="Initializing wallet please wait..."
        extendDirection="left"
        extend={true}
        id={1}
      />
    ) : (
      <WalletBalanceFlyer {...props} id={2} />
    ))
  );
};

export default connect(mapStateToProps)(TopStatus);
