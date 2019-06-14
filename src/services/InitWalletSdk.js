import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { TOKEN_ID } from '../constants';
import SetupDeviceWorkflow from './OstWalletCallbacks/SetupDeviceWorkflow';
import currenUserModel from '../models/CurrentUser';
import { PLATFROM_API_ENDPOINT } from '../constants';

class InitWalletSdk {
  initializeDevice = (setupDeviceDelegate) => {
    this.setupDevice(setupDeviceDelegate);
  };

  setupDevice = (setupDeviceDelegate) => {
    OstWalletSdk.setupDevice(currenUserModel.getOstUserId(), TOKEN_ID, new SetupDeviceWorkflow(setupDeviceDelegate));
  };
}

export default new InitWalletSdk();
