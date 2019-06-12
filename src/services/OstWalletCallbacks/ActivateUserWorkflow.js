import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import PollingHellper from "../PollingHelper";

class ActivateUserWorkflow extends OstWalletWorkFlowCallback {
  constructor( delegate ) {
    super();
    this.isRequestAcknowledge =  false ; 
    this.delegate =  delegate ; 
  }

  requestAcknowledged(ostWorkflowContext , ostContextEntity ) { 
    this.isRequestAcknowledge =  true; 
    this.delegate.onRequestAcknowledge( ostWorkflowContext , ostContextEntity ); 

    let userStatusTimeOut = setTimeout( ()=> {
      this.lonPoollUserStatus(); 
    } ,  10000 ) ;

   }

   lonPoollUserStatus(){
    let airdropStatus = new PepoApi( 'users/current' );
    airdropStatus
      .get()
      .then((res) => {
  
      }).catch((error) => {
  
    });
   }

   flowComplete(ostWorkflowContext, ostContextEntity) {
      //Do nothing..
    }
    
  flowInterrupt(ostWorkflowContext , ostError)  {  
      if( !this.isRequestAcknowledge ){
        this.delegate.onFlowInterrupt( ostWorkflowContext , ostError ); 
      }else{
        //TODO emit event
      }
   }
}


 class ActivateUserPolling extends PollingHellper {

    constructor(){
      super( ...arguments );
    }

 }

export default ActivateUserWorkflow;
