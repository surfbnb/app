import AsyncStorage from '@react-native-community/async-storage';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import ActivateUserWorkflow from './OstWalletCallbacks/ActivateUserWorkflow';

class ActivateUser {
  activateUser(pin) {
    AsyncStorage.getItem('user').then((user) => {
      user = JSON.parse(user);
      OstWalletSdk.activateUser(
        user.user_details.ost_user_id,
        pin,
        user.user_pin_salt,
        86400,
        '1000000000000000000',
        new ActivateUserWorkflow(),
        console.warn
      );
    });
  }
}

export default new ActivateUser();
