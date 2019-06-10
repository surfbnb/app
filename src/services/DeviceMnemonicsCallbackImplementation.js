import { Alert } from 'react-native';

class DeviceMnemonicsCallbackImplementation {
  constructor() {
    //super();
  }

  flowComplete(ostWorkflowContext, ostContextEntity) {
    console.log('flowComplete', arguments);
    Alert.alert('Device Mnemonics', ostContextEntity.entity);
  }
}

export default DeviceMnemonicsCallbackImplementation;
