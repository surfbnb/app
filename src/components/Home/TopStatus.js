import React from 'react';
import { connect } from 'react-redux';

import CurrentUser from '../../models/CurrentUser';
import WalletSetupFlyer from '../WalletSetupFlyer';
import WalletBalanceFlyer from '../WalletBalanceFlyer';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const mapStateToProps = (state) => ({
  balance: state.balance,
  userStatus: CurrentUser.__getUserStatus(),
  airDropStatus: CurrentUser.isAirDropped()
});

const TopStatus = (props) => {
  if (CurrentUser.isUserActivating() || (CurrentUser.isUserActivated() && !CurrentUser.isAirDropped())) {
    return (
      <WalletSetupFlyer
        componentHeight={46}
        componentWidth={46}
        sliderWidth={230}
        containerStyle={{
          ...ifIphoneX(
            {
              top: 60
            },
            {
              top: 30
            }
          ),
          right: 10
        }}
        displayText="Initializing wallet please wait..."
        extendDirection="left"
        extend={true}
        id={1}
      />
    );
  } else if (CurrentUser.isUserActivated()) {
    return <WalletBalanceFlyer {...props} id={2} />;
  } else {
    return null;
  }
};

export default connect(mapStateToProps)(TopStatus);
