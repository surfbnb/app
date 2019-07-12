import React, { PureComponent } from 'react';
import {TouchableWithoutFeedback , View } from "react-native";
import currentUserModel from '../../models/CurrentUser';
import PepoButton from "./PepoButton";
import appConfig from '../../constants/AppConfig';
import utilities from "../../services/Utilities";
import PepoApi from '../../services/PepoApi';
import pricer from "../../services/Pricer";
import PriceOracle from "../../services/PriceOracle";
import ExecuteTransactionWorkflow from '../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';
import reduxGetter from "../../services/ReduxGetters";
import { withNavigation } from 'react-navigation';

class TransactionPepoButton extends PureComponent {

    constructor(props){
        super(props); 
        this.state = {
          isDisabled : true
        }
    }

    excequteTransaction = ( btAmount ) =>{
        //TODO disabled all 
        if(!btAmount) return;
        this.sendTransactionToSdk( btAmount );
    };

    componentDidMount(){
      if( this.props.disabled || !currentUserModel.isUserActivated()  ){
        this.setState({isDisabled: true});
      }else{
        this.setState({isDisabled: false});
      }
    }

    onExcequteTransaction = () => {
        currentUserModel.checkActiveUser() && currentUserModel.isUserActivated(true); 
    }

    get toUser(){
        return reduxGetter.getUser( this.props.userId ); 
    }

    sendTransactionToSdk( btAmount ) {
        const user = currentUserModel.getUser();
        const option = { wait_for_finalization: false };
        const btInDecimal = PriceOracle.toDecimal(btAmount , pricer.getDecimal());
        this.workflow = new ExecuteTransactionWorkflow(this);
        OstWalletSdk.executeTransaction(
          user.ost_user_id,
          [this.toUser.ost_token_holder_address],
          [btInDecimal],
          appConfig.ruleTypeMap.directTransfer,
          this.getSdkMetaProperties(),
          this.workflow,
          option
        );
      }
    
      getSdkMetaProperties(){
        const metaProperties = clone( appConfig.metaProperties ); 
        if(this.props.videoId){
          metaProperties["name"] = "video"; 
          metaProperties["details"] = JSON.stringify({"vi" : this.props.videoId});
        }
        return metaProperties; 
      }
    
      onRequestAcknowledge(ostWorkflowContext, ostWorkflowEntity) {
        this.sendTransactionToPlatform(ostWorkflowEntity);
      }
    
      onFlowInterrupt(ostWorkflowContext, error) {
        this.error( error ) ; 
      }
    
      sendTransactionToPlatform(ostWorkflowEntity) {
        const params = this.getSendTransactionPlatformData(ostWorkflowEntity);
        new PepoApi('/ost-transactions')
          .post(params)
          .then((res) => {
            if (res && res.success) {
              this.onTransactionSuccess(res);
            } else {
              this.onError(res);
            }
          })
          .catch((error) => {
            this.onError(error);
          });
      }
    
      onTransactionSuccess(res) {
        pricer.getBalance(); //Dont call this.getBalance here, call getBalance;
      }
      
      onError( error ){
        //Revert everything via redux
        //And show toast 
      }

      getSendTransactionPlatformData(ostWorkflowEntity) {
        return {
          ost_transaction: deepGet(ostWorkflowEntity, 'entity'),
          ost_transaction_uuid: deepGet(ostWorkflowEntity, 'entity.id')
        };
      }

      onTransactionIconWrapperClick = () => {
        currentUserModel.checkActiveUser() && currentUserModel.isUserActivated() 
      }

    render(){
       return ( 
        <TouchableWithoutFeedback onPress={this.onTransactionIconWrapperClick}> 
            <View>
                  <PepoButton count={utilities.getToBt(this.props.totalBt)} 
                              disabled={this.state.isDisabled}
                              excequteTransaction={this.excequteTransaction} /> 
           </View>                  
        </TouchableWithoutFeedback>                     
       )
    }

}

export default withNavigation( TransactionPepoButton );