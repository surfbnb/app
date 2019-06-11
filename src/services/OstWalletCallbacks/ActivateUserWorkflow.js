import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';

class ActivateUserWorkflow extends OstWalletWorkFlowCallback {
  constructor( delegate ) {
    super();
    this.isRequestAcknowledge =  false ; 
    this.delegate =  delegate ; 
  }

  requestAcknowledged(ostWorkflowContext , ostContextEntity ) { 
    this.isRequestAcknowledge =  true; 
    this.delegate.onRequestAcknowledge( ostWorkflowContext , ostContextEntity ); 
   }

   flowComplete(ostWorkflowContext, ostContextEntity) {
      //TODO long poll balance 
    }
    
  flowInterrupt(ostWorkflowContext , ostError)  {  
      if( !this.isRequestAcknowledge ){
        this.delegate.onFlowInterrupt( ostWorkflowContext , ostError ); 
      }else{
        //TODO emit event
      }
   }
}

export default ActivateUserWorkflow;
