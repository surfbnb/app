import { Alert } from 'react-native';

import OstWalletSdkCallbackImplementation from './OstWalletSdkCallbackImplementation';

class DeviceMnemonicsCallbackImplementation extends OstWalletSdkCallbackImplementation {
  constructor() {
    super();
  }

  flowComplete(ostWorkflowContext, ostContextEntity) {
    console.log('flowComplete', arguments);
    Alert.alert('Device Mnemonics', ostContextEntity.entity);
  }
}

export default DeviceMnemonicsCallbackImplementation;
