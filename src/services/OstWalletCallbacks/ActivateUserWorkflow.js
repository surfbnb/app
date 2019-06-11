import AsyncStorage from '@react-native-community/async-storage';
import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import { API_ROOT } from './../../constants';

class ActivateUserWorkflow extends OstWalletWorkFlowCallback {
  constructor( delegate ) {
    super();
    this.isRequestAcknowledge =  false ; 
    this.delegate =  delegate ; 
  }

  flowComplete(ostWorkflowContext, ostContextEntity) {
    console.log('flowComplete ostWorkflowContext', ostWorkflowContext, 'ostContextEntity', ostContextEntity);
    AsyncStorage.getItem('user').then((user) => {
      user = JSON.parse(user);
      if (user.user_details.ost_status === 'CREATED') {
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

  requestAcknowledged(ostWorkflowContext , ostContextEntity ) { 
    this.isRequestAcknowledge =  true; 
    this.delegate.onRequestAcknowledge( ostWorkflowContext , ostContextEntity ); 
   }

  flowComplete(ostWorkflowContext , ostContextEntity ) {   
      //TODO long poll for Api 
  }

    
  flowInterrupt(ostWorkflowContext , ostError)  {  
      if( !this.isRequestAcknowledge ){
        this.delegate.onFlowInterrupt( ostWorkflowContext , ostError ); 
      }
   }
}

export default ActivateUserWorkflow;
