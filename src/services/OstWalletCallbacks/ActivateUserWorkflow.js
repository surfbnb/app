import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import currentUserModal from '../../models/CurrentUser';
import { showToast } from '../../actions';
import Store from '../../store';
import deepGet from 'lodash/get';

const initiatePolling = (expectedUserId) => {
  let stopPolling = false,
    currentRetry = 0,
    maxRetry = 5;

  const scheduleAirdropStatusPoll = function() {
    if (stopPolling || currentRetry > maxRetry) return;
    longPollUser();
  };

  const longPollUser = function() {
    setTimeout(() => {
      currentUserModal &&
        currentUserModal
          .sync()
          .then((user) => {
            const currentUserId = currentUserModal.getOstUserId();
            if (currentUserId != expectedUserId) {
              stopPolling = true;
              return;
            }
            const airDropStatus = user && user.signup_airdrop_status;
            if (airDropStatus == 1) {
              stopPolling = true;
              Store.dispatch(showToast('User Activated! Airdrop is initiated.'));
            }
          })
          .catch((error) => {
            currentRetry++;
          })
          .finally(scheduleAirdropStatusPoll);
    }, 10000);
  };

  if (expectedUserId == currentUserModal.getOstUserId()) {
    scheduleAirdropStatusPoll();
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
    const expectedUserId = deepGet(ostContextEntity, 'entity.id');
    initiatePolling(expectedUserId);
  }

  flowComplete(ostWorkflowContext, ostContextEntity) {}

  flowInterrupt(ostWorkflowContext, error) {
    if (!this.isRequestAcknowledge) {
      this.delegate.onFlowInterrupt(ostWorkflowContext, error);
    }
  }
}

export default ActivateUserWorkflow;
