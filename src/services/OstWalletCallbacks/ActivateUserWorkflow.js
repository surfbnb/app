import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import currentUserModal from '../../models/CurrentUser';
import { Alert } from 'react-native';
import { showToast, hideToast } from '../../actions';
import Store from '../../store';

const initiatePolling = () => {
  let stopPolling = false,
    currentRetry = 0,
    maxRetry = 5;
  const scheduleAirdropStatusPoll = function() {
    if (stopPolling || currentRetry > maxRetry) return;
    longPollUser();
  };

  const longPollUser = function() {
    setTimeout(() => {
      currentUserModal
        .sync()
        .then((user) => {
          const airDropStatus = user && user.signup_airdrop_status;
          if (airDropStatus == 1) {
            stopPolling = true;
            // Alert.alert('User Activated', 'TODO show airdrop toast!');
            Store.dispatch(showToast('User Activated! Airdrop is initiated.'));
          }
        })
        .catch((error) => {
          currentRetry++;
        })
        .finally(scheduleAirdropStatusPoll);
    }, 10000);
  };

  scheduleAirdropStatusPoll();
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
    initiatePolling();
  }

  flowComplete(ostWorkflowContext, ostContextEntity) {}

  flowInterrupt(ostWorkflowContext, ostError) {
    if (!this.isRequestAcknowledge) {
      this.delegate.onFlowInterrupt(ostWorkflowContext, ostError);
    }
  }
}

export default ActivateUserWorkflow;
