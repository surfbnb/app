import FormData from 'form-data';
import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import { API_ROOT } from './../../constants';

import store from '../../store';
import { updateDeviceRegistered } from '../../actions';

const formData = new FormData();

class SetupDevice extends OstWalletWorkFlowCallback {
  constructor() {
    super();
  }

  registerDevice(apiParams, ostDeviceRegistered) {
    console.log('registerDevice apiParams', apiParams, ostDeviceRegistered);
    //TODO updateDeviceRegistered status update
    let payload = {
      device_address: apiParams.address || apiParams.device.address,
      api_signer_address: apiParams.api_signer_address || apiParams.device.api_signer_address
    };
    fetch(`${API_ROOT}/register-device`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.data) {
          console.log('data to send:', responseData.data[responseData.data.result_type]);
          //
          ostDeviceRegistered.deviceRegistered(responseData.data[responseData.data.result_type], (error) => {
            console.warn(error);
          });
        }
      })
      .catch(console.warn)
      .done();
  }

  flowComplete(ostWorkflowContext, ostContextEntity) {
    //TODO updateDeviceRegistered status update
  }

  flowInterrupt(ostWorkflowContext, ostError) {
    //TODO updateDeviceRegistered status update
  }

  requestAcknowledged(ostWorkflowContext, ostContextEntity) {
    console.warn('In requestAcknowledged, nothing done here , what is expected');
  }

  verifyData(ostWorkflowContext, ostContextEntity, ostVerifyData) {
    console.warn('In verifyData, nothing done here , what is expected');
  }
}

export default SetupDevice;
