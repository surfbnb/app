import React, { Component } from 'react';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import { View, Text , TouchableOpacity  ,Switch} from 'react-native';
import FormInput from "../../theme/components/FormInput"
import Giphy from '../Giphy';
import Theme from '../../theme/styles';
import deepGet from "lodash/get";
import PepoApi from "../../services/PepoApi";
import PriceOracle from "../../services/PriceOracle";
import currentUserModal from "../../models/CurrentUser"; 
import errorMessage from "../../constants/ErrorMessages";
import utilities from "../../services/Utilities";
import Store from "../../store";
import {showModal , hideModal} from "../../actions";
import appConfig from "../../constants/AppConfig";
import {TOKEN_ID} from "../../constants";
import ExecuteTransactionWorkflow from "../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow"; 


class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      clearErrors: false,
      server_errors: null,
      isPrivate: false,
      general_error: "",
      btAmount: 1,
      btUSDAmount: null 
    };
    this.baseState = this.state ; 
  }

  defaultVals(){
    //TODO lets see how to optimise this
    this.meta = null ; 
    this.gify = null;
    this.priceOracle = null ; 
    this.btSmallestUnit = null ; 
    this.workflow = null;
  }

  componentWillMount(){
    this.defaultVals();
    this.initPricePoint(); 
  }

  componentWillUnmount(){
    this.defaultVals();
    this.setState(this.baseState); 
  }

  initPricePoint(){
    this.updatePricePoint();
  }

  updatePricePoint( successCallback , errorCallback   ){
    const ostUserId = currentUserModal.getOstUserId(); 
    OstWalletSdk.getToken( TOKEN_ID ,  ( token  ) => {
      OstJsonApi.getBalanceWithPricePointForUserId( ostUserId , (res)=>{
        this.onGetPricePointSuccess(token , res); 
        successCallback && successCallback(res);
      } , (ostError) => {
        errorCallback && errorCallback( ostError ) ; 
      })
    })
  }

 onGetPricePointSuccess( token , res ){
  res =  res || {}; 
  let btUSDAmount = null ; 
  this.priceOracle = new PriceOracle( token , res.price_point );
  this.btSmallestUnit = this.priceOracle.getToDecimal( this.btAmount );
  btUSDAmount = this.priceOracle.getBtToFiat( this.btSmallestUnit ); 
  this.setState({ btUSDAmount : btUSDAmount });
 }

 onGetPricePointError( ostError ){
    this.onError( ostError );
 }

  excequteTransaction(){
    if( !this.isValids() ){
      alert.alert("" , errorMessage.general_error_ex );
      return; 
    }
    Store.dispatch(showModal("Executing transaction..."));
    this.sendTransactionToSdk();
  }

  isValids(){
    return !!this.priceOracle;
  }

  sendTransactionToSdk(){
    currentUserModal.getUser()
    .then( (user) => {
      const option = { wait_for_finalization : false };
      this.workflow = new ExecuteTransactionWorkflow( this ); 
      OstWalletSdk.executeTransaction(user.ost_user_id, 
                                      user.ost_token_holder_address,
                                      this.btSmallestUnit, 
                                      appConfig.ruleTypeMap.directTransfer, 
                                      appConfig.metaProperties, 
                                      this.workflow,
                                      option)
    })
    .catch( (error)=>{
      this.onError( error );
    })
  }

  onRequestAcknowledge( ostWorkflowContext , ostWorkflowEntity ){
    //TODO decide path
    this.sendTransactionToPlatfrom( deepGet(ostWorkflowEntity, "ost_transaction_uuid") );
  }

  onFlowInterrupt( ostWorkflowContext, ostError ){
    this.onError( ostError );
  }

  sendTransactionToPlatfrom( uuid ){
    const params =  this.getSendTransactionPlatformData( uuid );
    new PepoApi("/ost-transactions")
    .post(params)
    .then( (res ) => {
     this.onTransactionSuccess( res );
    })
    .catch((error)=> {
      this.onError( error );
    })
  }

  onTransactionSuccess( res ){
    Store.dispatch(hideModal());
    utilities.showAlert( "",  "TODO confrim what to do on transaction success" );
  }

  getSendTransactionPlatformData( uuid ){
    return {
      "ost_transaction_uuid": uuid,
      "privacy_type": this.getPrivacyType(),
      "meta": {
        "text" : this.state.message,
        "giphy": this.gify
      }
    }
  }

  getPrivacyType(){
    return this.state.isPrivate ? appConfig.executeTransactionPrivacyType.private : appConfig.executeTransactionPrivacyType.public ;
  }

  onError( ostError ){
    const errorMsg = ostError && ( ostError.getApiErrorMessage() || ostError.getApiErrorMessage()) 
                     || deepGet( ostError ,  "err.msg")
                    errorMessage.general_error;
    this.setState({ general_error : errorMsg});
    Store.dispatch(hideModal()); 
    utilities.showAlert("" , errorMsg );
  }

  clearErrors(){
    this.setState({ clearErrors : false , server_errors : null });
  }

  onGifySelect( gify ){
    this.gify = gify; 
    console.log("gify" , gify );
  }

  onBtChange( bt ){
    console.log("onBtChange" , bt );
  }

  onUSDChange( usd ){
    console.log("onUSDChange" , usd );
  }

  render() {
    return (
      <View style={styles.container}>
        <Giphy onGifySelect={ (gify) => { this.onGifySelect( gify ) }} />

        <Text>+ Add Message</Text>

        <FormInput
            editable={true}
            onChangeText={(message) => this.setState({ message:  message })}
            placeholder="Message"
            fieldName="message"
            style={[Theme.TextInput.textInputStyle, this.state.password_error ? Theme.Errors.errorBorder : {}]}
            value={this.state.message}
            returnKeyType="done"
            returnKeyLabel="done"
            serverErrors={this.state.server_errors}
            clearErrors={this.state.clearErrors}
            placeholderTextColor="#ababab"
          />

        <Switch value = {this.state.isPrivate}
                onValueChange={( isPrivate ) => this.setState({isPrivate})}></Switch>

         <FormInput
            editable={true}
            onKeyPress={(val) => this.onBtChange( val )}
            placeholder="BT"
            fieldName="bt_amount"
            style={[Theme.TextInput.textInputStyle, this.state.password_error ? Theme.Errors.errorBorder : {}]}
            value= {`${this.state.btAmount}`}
            returnKeyType="next"
            returnKeyLabel="next"
            serverErrors={this.state.server_errors}
            clearErrors={this.state.clearErrors}
            placeholderTextColor="#ababab"
            keyboardType = 'numeric'
          />

          <FormInput
            editable={true}
            onKeyPress={(val) => this.onUSDChange( val ) }
            placeholder="USD"
            fieldName="usd_amount"
            style={[Theme.TextInput.textInputStyle, this.state.password_error ? Theme.Errors.errorBorder : {}]}
            value={`${this.state.btUSDAmount}`}
            returnKeyType="done"
            returnKeyLabel="done"
            serverErrors={this.state.server_errors}
            clearErrors={this.state.clearErrors}
            placeholderTextColor="#ababab"
            keyboardType = 'numeric'
          />

        <TouchableOpacity
              style={{position:"absolute", top: 0}}
              onPress={() =>
                this.excequteTransaction()
              }
            ></TouchableOpacity>

      </View>
    );
  }
}

export default TransactionScreen;
