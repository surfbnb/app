import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import PollingHellper from '../PollingHelper';
import deepGet from 'lodash/get';

const onUserStatusSuccess = function(res) {
  const resultType = deepGet(res, 'data.result_type') ,
        loginUser = deepGet(res, `data.${resultType}`) || {};
  airDropStatus = loginUser.signup_airdrop_status;
  if (airDropStatus == 1) {
    this.shouldPoll = false;
    //TODO dispatch event for TOAST display 
  }
};

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

export default ActivateUserWorkflow;
