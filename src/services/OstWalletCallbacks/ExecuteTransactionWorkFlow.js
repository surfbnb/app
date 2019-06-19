import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';

class ExecuteTransactionWorkflow extends OstWalletWorkFlowCallback {
  constructor(delegate) {
    super();
    this.isRequestAcknowledge = false;
    this.delegate = delegate;
  }

  requestAcknowledged(ostWorkflowContext, ostContextEntity) {
    this.isRequestAcknowledge = true;
    this.delegate.onRequestAcknowledge(ostWorkflowContext, ostContextEntity);
  }

  flowInterrupt(ostWorkflowContext, error) {
    if (!this.isRequestAcknowledge) {
      this.delegate.onFlowInterrupt(ostWorkflowContext, error);
    }
  }
}

export default ExecuteTransactionWorkflow;
