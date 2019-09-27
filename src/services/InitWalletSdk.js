import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { TOKEN_ID } from '../constants';
import SetupDeviceWorkflow from './OstWalletCallbacks/SetupDeviceWorkflow';

let CurrentUser;
import('../models/CurrentUser').then((imports) => {
  CurrentUser = imports.default;
});

class InitWalletSdk {
  initializeDevice = (setupDeviceDelegate) => {
    this.setupDevice(setupDeviceDelegate);
  };

  setupDevice = (setupDeviceDelegate) => {
    OstWalletSdk.setupDevice(CurrentUser.getOstUserId(), TOKEN_ID, new SetupDeviceWorkflow(setupDeviceDelegate));
  };

  promisifiedSetupDevice() {
    return new Promise((resolve, reject)=> {
      let setupDeviceDelegate = {
        setupDeviceComplete: (ostWorkflowContext, ostContextEntity) => {
          resolve(ostContextEntity);
        },
        setupDeviceFailed: (ostWorkflowContext, error) => {
          resolve(error);
        }
      };
      OstWalletSdk.setupDevice(CurrentUser.getOstUserId(), TOKEN_ID, new SetupDeviceWorkflow(setupDeviceDelegate));
    })
  }
}

export default new InitWalletSdk();
