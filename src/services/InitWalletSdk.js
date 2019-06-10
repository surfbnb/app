import AsyncStorage from '@react-native-community/async-storage';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { TOKEN_ID } from '../constants';
import SetupDeviceWorkflow from './OstWalletCallbacks/SetupDevice';

class InitWalletSdk {
  initializeDevice = () => {
    //TODO get from env vars
    OstWalletSdk.initialize('https://api.stagingost.com/testnet/v2', (err, success) => {
      if (success) {
        this.setupDevice();
      }
    });
  };

  setupDevice = () => {
    AsyncStorage.getItem('user').then(async (user) => {
      user = JSON.parse(user);
      OstWalletSdk.setupDevice(user.user_details.user_id, TOKEN_ID, new SetupDeviceWorkflow());
    });
  };
}

export default new InitWalletSdk();
