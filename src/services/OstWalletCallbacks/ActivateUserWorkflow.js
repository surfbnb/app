import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import PollingHellper from '../PollingHelper';
import deepGet from 'lodash/get';
import utilities from '../Utilities';
import deepClone from 'lodash/cloneDeep';

class ActivateUserWorkflow extends OstWalletWorkFlowCallback {
  constructor(delegate) {
    super();
    this.isRequestAcknowledge = false;
    this.delegate = delegate;
  }

  requestAcknowledged(ostWorkflowContext, ostContextEntity) {
    this.isRequestAcknowledge = true;
    this.delegate.onRequestAcknowledge(ostWorkflowContext, ostContextEntity);

    new PollingHellper({
      pollingApi: '/users/current',
      successCallback: onUserStatusSuccess,
      pollingInterval: 10000
    });
  }

  flowComplete(ostWorkflowContext, ostContextEntity) {}

  flowInterrupt(ostWorkflowContext, ostError) {
    if (!this.isRequestAcknowledge) {
      this.delegate.onFlowInterrupt(ostWorkflowContext, ostError);
    }
  }
}

const onUserStatusSuccess = function(res) {
  const loginUser = deepGet(res, 'data.logged_in_user') || {};
  airDropStatus = loginUser.signup_airdrop_status;
  if (airDropStatus == 1) {
    this.shouldPoll = false;
    AsyncStorage.getItem('user').then((user) => {
      utilities.saveItem('user', deepClone(user, loginUser));
    });
  }
};

export default ActivateUserWorkflow;
