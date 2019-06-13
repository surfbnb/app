import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import { API_ROOT } from './../../constants';
import PepoApi from "../PepoApi";

class SetupDeviceWorkflow extends OstWalletWorkFlowCallback {
  constructor(delegate) {
    super();
    this.delegate = delegate;
  }

  registerDevice(apiParams, ostDeviceRegistered) {
    console.log('registerDevice apiParams', apiParams, ostDeviceRegistered);
    let payload = {
      device_address: apiParams.address || apiParams.device.address,
      api_signer_address: apiParams.api_signer_address || apiParams.device.api_signer_address
    };
    new PepoApi("/users/register-device")
    .post( payload )
    .then((responseData) => {
      if (responseData.success && responseData.data) {
        console.log('data to send:', responseData.data[responseData.data.result_type]);
        //
        ostDeviceRegistered.deviceRegistered(responseData.data[responseData.data.result_type], (error) => {
          console.warn(error);
        });
      } else {
        // cancel workflow.
        ostDeviceRegistered.cancelFlow();
      }
    })
    .catch(() => {
      // cancel workflow.
      ostDeviceRegistered.cancelFlow();
    })
  }

  flowComplete(ostWorkflowContext, ostContextEntity) {
    if (this.delegate && this.delegate.setupDeviceComplete) {
      this.delegate.setupDeviceComplete(ostWorkflowContext, ostContextEntity);
    }
  }

  flowInterrupt(ostWorkflowContext, ostError) {
    if (this.delegate && this.delegate.setupDeviceFailed) {
      this.delegate.setupDeviceFailed(ostWorkflowContext, ostError);
    }
  }

  requestAcknowledged(ostWorkflowContext, ostContextEntity) {
    console.warn('In requestAcknowledged, nothing done here , what is expected');
  }

  verifyData(ostWorkflowContext, ostContextEntity, ostVerifyData) {
    console.warn('In verifyData, nothing done here , what is expected');
  }
}

export default SetupDeviceWorkflow;
