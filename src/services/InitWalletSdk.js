import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { TOKEN_ID } from '../constants';
import SetupDeviceWorkflow from './OstWalletCallbacks/SetupDeviceWorkflow';

let currenUserModel;
import('../models/CurrentUser').then((imports) => {
  currenUserModel = imports.default;
});

class InitWalletSdk {
  initializeDevice = (setupDeviceDelegate) => {
    this.setupDevice(setupDeviceDelegate);
  };

  setupDevice = (setupDeviceDelegate) => {
    OstWalletSdk.setupDevice(currenUserModel.getOstUserId(), TOKEN_ID, new SetupDeviceWorkflow(setupDeviceDelegate));
  };
}

export default new InitWalletSdk();
