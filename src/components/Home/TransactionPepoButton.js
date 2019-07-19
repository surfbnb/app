import React, { PureComponent } from 'react';
import {TouchableWithoutFeedback , View } from "react-native";
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { Toast } from 'native-base';
import deepGet from "lodash/get";

import clone from "lodash/clone";
import {connect} from 'react-redux';
import currentUserModel from '../../models/CurrentUser';
import PepoButton from "./PepoButton";
import appConfig from '../../constants/AppConfig';
import utilities from "../../services/Utilities";
import PepoApi from '../../services/PepoApi';
import pricer from "../../services/Pricer";
import Store from "../../store";
import {updateExecuteTransactionStatus , updateBalance} from "../../actions";
import ExecuteTransactionWorkflow from '../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';
import reduxGetter from "../../services/ReduxGetters";
import { ostErrors } from '../../services/OstErrors';


const mapStateToProps = (state) => ({ balance: state.balance ,  disabled: state.executeTransactionDisabledStatus  });

class TransactionPepoButton extends PureComponent {

    constructor(props){
        super(props); 
        this.state = {
          totalBt : Number(  this.props.totalBt )
        }
    }

    componentWillUpdate(nextProps ,  nextState){
      if(this.state.totalBt != nextProps.totalBt ){
        this.state.totalBt = nextProps.totalBt;
      }
    }

    isDisabled = () => {
      return !this.isBalance() || this.isDisabledWithoutColor() || !!this.props.disabled ; 
    }

    isDisabledWithoutColor = () => {
      return !currentUserModel.isUserActivated() ; 
    }
    
    isBalance = () => {
      return this.getBalanceToNumber() >= 1 ? true : false ; 
    }

    getBalanceToNumber = () =>{
      return this.props.balance &&  Number( pricer.getFromDecimal( this.props.balance ) ) || 0 ;
    }

    get toUser(){
        return reduxGetter.getUser( this.props.userId ); 
    }

    sendTransactionToSdk( btAmount ) {
        const user = currentUserModel.getUser();
        const option = { wait_for_finalization: false };
        const btInDecimal =  utilities.getToDecimal(btAmount);
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
        metaProperties["details"] = `vi_${this.props.videoId}`;
      }
      return metaProperties; 
    }
    
    onRequestAcknowledge(ostWorkflowContext, ostWorkflowEntity) {
      this.reduxUpdate(false);
      pricer.getBalance();
      this.sendTransactionToPlatform(ostWorkflowEntity);
    }
  
    onFlowInterrupt(ostWorkflowContext, error) {
      this.onSdkError( error , ostWorkflowContext) ; 
    }
  
    sendTransactionToPlatform(ostWorkflowEntity) {
      const params = this.getSendTransactionPlatformData(ostWorkflowEntity);
      new PepoApi('/ost-transactions')
        .post(params)
        .then((res) => {
          if (res && res.success) {
            this.onTransactionSuccess(); 
          } else {
            this.onTransactionError();
          }
        })
        .catch((error) => {
          this.onTransactionError();
        });
    }
  
    onTransactionSuccess(res) {
      //Ignore dont do anything 
    }

    onTransactionError(){
      //TODO Retry , in future. 
    }
    
    onSdkError( error , ostWorkflowContext ){
       setTimeout(() => {
        this.onLocalReset(false);
        pricer.getBalance();
        Toast.show({
          text: ostErrors.getErrorMessage( error )
        });
       }, 1000 )
    }

    getSendTransactionPlatformData(ostWorkflowEntity) {
      return {
        ost_transaction: deepGet(ostWorkflowEntity, 'entity'),
        ost_transaction_uuid: deepGet(ostWorkflowEntity, 'entity.id'),
        meta: {
          vi: this.props.videoId
        }
      };
    }

    onTransactionIconWrapperClick = () => {
      currentUserModel.checkActiveUser() && currentUserModel.isUserActivated(true);
    }

    reduxUpdate( isTXBtnDisabled , balance ){
      if( isTXBtnDisabled !== undefined ){
        Store.dispatch(updateExecuteTransactionStatus(isTXBtnDisabled));
      }
      if( balance !== undefined ){
        balance = utilities.getToDecimal( balance );
        Store.dispatch(updateBalance(balance));
      }  
    }

    onPressOut = ( btAmount , totalBt ) => {
        this.onLocalUpdate( btAmount , totalBt );
        this.sendTransactionToSdk( btAmount );
    }

    onLocalUpdate( btAmount , totalBt ){
      this.btAmount =  btAmount ; 
      let expectedTotal = this.state.totalBt + btAmount;
      this.state.totalBt = expectedTotal ; 
      this.reduxUpdate( true ,  this.getBalanceToUpdate( btAmount ));
      this.props.onLocalUpdate && this.props.onLocalUpdate( expectedTotal ); 
    }

    onLocalReset( ){
      const resetBtAmout = this.state.totalBt - this.btAmount; 
      this.setState({totalBt : resetBtAmout} , () => {
        this.reduxUpdate(false);
      }); 
     this.props.onLocalReset && this.props.onLocalReset( resetBtAmout ); 
    }

    getBalanceToUpdate( updateAmount , isRevert ){
      if(!updateAmount) return  ; 
      let balance = pricer.getFromDecimal( this.props.balance );
      balance = balance && Number( balance ) || 0 ;
      updateAmount =  updateAmount && Number( updateAmount ) || 0 ;
      if( isRevert ){
       return  balance + updateAmount ; 
      }else {
        return balance - updateAmount ; 
      }
    }
    
    onMaxReached = () => {    
      Toast.show({
        text: ostErrors.getUIErrorMessage( "maxAllowedBt" )
      });
    }

    render(){

      console.log("====TransactionPepoButton=====");

       return ( 
        <TouchableWithoutFeedback onPress={this.onTransactionIconWrapperClick}> 
            <View>
                <PepoButton count={ this.state.totalBt }
                            isSelected={this.props.isSupported}
                            id={this.props.feedId}
                            disabled={this.isDisabled()}
                            isDisabledWithoutColor={this.isDisabledWithoutColor}
                            maxCount={this.getBalanceToNumber()}
                            onMaxReached={this.onMaxReached}
                            onPressOut={this.onPressOut} /> 
           </View>                  
        </TouchableWithoutFeedback>                     
       )
    }

}

export default connect(mapStateToProps)(TransactionPepoButton) ;