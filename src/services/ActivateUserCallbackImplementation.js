import OstWalletSdkCallbackImplementation from './OstWalletSdkCallbackImplementation';
import AsyncStorage from '@react-native-community/async-storage';
import { API_ROOT } from './../constants';

class ActivateUserCallbackImplementation extends OstWalletSdkCallbackImplementation {
  constructor() {
    super();
  }

  flowComplete(ostWorkflowContext, ostContextEntity) {
    console.log('flowComplete ostWorkflowContext', ostWorkflowContext, 'ostContextEntity', ostContextEntity);
    AsyncStorage.getItem('user').then((user) => {
      user = JSON.parse(user);
      if (user.user_details.status === 'CREATED') {
        fetch(`${API_ROOT}/notify/user-activate`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((response) => response.json())
          .then((responseData) => {
            console.log('user-activate responseData:', responseData);
          })
          .catch(console.warn)
          .done();
      }
    });
  }
}

export default ActivateUserCallbackImplementation;
