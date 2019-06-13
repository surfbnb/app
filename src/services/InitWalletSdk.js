import AsyncStorage from '@react-native-community/async-storage';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { TOKEN_ID } from '../constants';
import SetupDeviceWorkflow from './OstWalletCallbacks/SetupDeviceWorkflow';
import currenUserModel from "../models/CurrentUser";

class InitWalletSdk {
  initializeDevice = (setupDeviceDelegate) => {
    //TODO get from env vars
    OstWalletSdk.initialize('https://api.stagingost.com/testnet/v2', (ostError, success) => {
      if (success) {
        this.setupDevice(setupDeviceDelegate);
      } else if (setupDeviceDelegate) {
        setupDeviceDelegate.setupDeviceFailed(null, ostError);
      }
    });
  };

  setupDevice = (setupDeviceDelegate) => {
    //AsyncStorage.getItem('user').then(async (user) => {
    //  user = JSON.parse(user);
    //  console.log("setupDevice starting setupDevice. user:", user);
      OstWalletSdk.setupDevice( currenUserModel.getOstUserId(), TOKEN_ID, new SetupDeviceWorkflow(setupDeviceDelegate));
    //});
  };
}

export default new InitWalletSdk();
