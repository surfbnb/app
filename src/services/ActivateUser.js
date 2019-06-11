import AsyncStorage from '@react-native-community/async-storage';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import ActivateUserWorkflow from './OstWalletCallbacks/ActivateUserWorkflow';
import { SESSION_KEY_EXPIRY_TIME } from '../constants';
import { SPENDING_LIMIT } from '../constants';


class ActivateUser {
  activateUser(pin , delegate) {
    AsyncStorage.getItem('user').then((user) => {
      user = JSON.parse(user);
      OstWalletSdk.activateUser(
        user.user_details.ost_user_id,
        pin,
        user.user_pin_salt,
        SESSION_KEY_EXPIRY_TIME,
        SPENDING_LIMIT,
        new ActivateUserWorkflow( delegate )
      );
    });
  }
}

export default new ActivateUser();
