import React, { Component } from 'react';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import {View, Text,Alert, TextInput, Switch, TouchableOpacity, Dimensions,Modal} from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';
import FormInput from '../../theme/components/FormInput';
import Giphy from '../Giphy';
import Theme from '../../theme/styles';
import deepGet from 'lodash/get';
import PepoApi from '../../services/PepoApi';
import PriceOracle from '../../services/PriceOracle';
import currentUserModal from '../../models/CurrentUser';
import errorMessage from '../../constants/ErrorMessages';
import utilities from '../../services/Utilities';
import Store from '../../store';
import { showModal, hideModal } from '../../actions';
import appConfig from '../../constants/AppConfig';
import { TOKEN_ID } from '../../constants';
import LoadingModal from '../../components/LoadingModal';
import ExecuteTransactionWorkflow from '../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';

class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      clearErrors: false,
      server_errors: null,
      isPrivate: false,
      general_error: '',
      btAmount: 1,
      btUSDAmount: null ,
      messageTextInput : false,
      addMessageBtnVisible : true,
      switchToggleState : false,
      transactionModal : false
    };
    this.baseState = this.state;
  }

  defaultVals() {
    //TODO lets see how to optimise this
    this.meta = null;
    this.gify = null;
    this.priceOracle = null;
    this.btSmallestUnit = null;
    this.workflow = null;
  }

  componentWillMount() {
    this.defaultVals();
    this.initPricePoint();
  }

  componentWillUnmount() {
    this.defaultVals();
    this.setState(this.baseState);
  }

  initPricePoint() {
    this.updatePricePoint();
  }

  updatePricePoint(successCallback, errorCallback) {
    const ostUserId = currentUserModal.getOstUserId();
    OstWalletSdk.getToken(TOKEN_ID, (token) => {
      OstJsonApi.getBalanceWithPricePointForUserId(
        ostUserId,
        (res) => {
          this.onGetPricePointSuccess(token, res);
          successCallback && successCallback(res);
        },
        (ostError) => {
          errorCallback && errorCallback(ostError);
        }
      );
    });
  }

  onGetPricePointSuccess(token, res) {
    res = res || {};
    let btUSDAmount = null;
    this.priceOracle = new PriceOracle(token, res.price_point);
    this.btSmallestUnit = this.priceOracle.toDecimal(this.state.btAmount);
    btUSDAmount = this.priceOracle.getBtToFiat(this.btSmallestUnit);
    this.setState({ btUSDAmount: btUSDAmount });
  }

  onGetPricePointError(ostError) {
    this.onError(ostError);
  }

  excequteTransaction() {
    if (!this.isValids()) {
      Alert.alert('', errorMessage.general_error_ex);
      return;
    }
    Store.dispatch(showModal('Executing...'));
    this.sendTransactionToSdk();
  }

  isValids() {
    return !!this.priceOracle;
  }

  sendTransactionToSdk() {
    const user = currentUserModal.getUser();
    const option = { wait_for_finalization: false };
    this.workflow = new ExecuteTransactionWorkflow(this);
    OstWalletSdk.executeTransaction(
      user.ost_user_id,
      [user.ost_token_holder_address],
      [this.btSmallestUnit],
      appConfig.ruleTypeMap.directTransfer,
      appConfig.metaProperties,
      this.workflow,
      option
    );
  }

  onRequestAcknowledge(ostWorkflowContext, ostWorkflowEntity) {
    this.sendTransactionToPlatfrom(ostWorkflowEntity);
  }

  onFlowInterrupt(ostWorkflowContext, ostError) {
    this.onError(ostError);
  }

  sendTransactionToPlatfrom(ostWorkflowEntity) {
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
    Store.dispatch(hideModal());
    utilities.showAlert('', 'TODO confrim what to do on transaction success');
  }

  getSendTransactionPlatformData(ostWorkflowEntity) {
    return {
      ost_transaction: deepGet(ostWorkflowEntity, 'entity'),
      ost_transaction_uuid: deepGet(ostWorkflowEntity, 'entity.id'),
      privacy_type: this.getPrivacyType(),
      meta: {
        text: this.state.message,
        giphy: this.gify
      }
    };
  }

  getPrivacyType() {
    return this.state.isPrivate
      ? appConfig.executeTransactionPrivacyType.private
      : appConfig.executeTransactionPrivacyType.public;
  }

  onError(ostError) {
    const errorMsg = utilities.getErrorMessage(ostError);
    this.setState({ general_error: errorMsg });

    Store.dispatch(hideModal());
    utilities.showAlert('', errorMsg);
  }

  clearErrors() {
    this.setState({ clearErrors: false, server_errors: null });
  }

  onGifySelect(gify) {
    this.gify = gify;
    console.log('gify', gify);
  }

  onBtChange(bt) {
    console.log('onBtChange', bt);
  }

  onUSDChange(usd) {
    console.log('onUSDChange', usd);
  }
  switchOnChangeHandler(value){
    console.log('in switchOnChangeHandler');
    this.setState({switchToggleState : value});
  }

  render() {
    return (
      <View style={[styles.container,{flexDirection:'column',flex:1,}]}>


        <Giphy
          onGifySelect={(gify) => {
            this.onGifySelect(gify);
          }}
        />

        <View style={{flexDirection:'row'}}>
          {/*{  This is add message button }*/}
          {this.state.addMessageBtnVisible && (
            <TouchableOpacity style={{flex:1}}
                              onPress={() =>{this.setState({addMessageBtnVisible:false,messageTextInput:true})}}>
              <Text style={{color:'rgb(50,150,208)', fontSize:16}}>+Add Message</Text>
            </TouchableOpacity>
          )}

          {/* This is Share publically switch */}
          <Switch
            value = {this.state.isPrivate}
            style={{flex:1,justifyContent:'flex-end',borderEndColor : '#EF5566'}}
            onValueChange={( isPrivate ) => {
              this.setState({isPrivate})
              this.switchOnChangeHandler.bind(this)
            }}
            thumbColor = '#EF5566'
            trackColor = {{false:'#ffffff',true:'#EF5566'}}>
          </Switch>
        </View>


        {this.state.messageTextInput &&(
          <FormInput
            autoFocus={true}
            editable={true}
            onChangeText={(message) => this.setState({ message:  message })}
            placeholder="Message"
            fieldName="message"
            style={[Theme.TextInput.textInputStyle, this.state.password_error ? Theme.Errors.errorBorder : {},{backgroundColor:'#ffffff'}]}
            value={this.state.message}
            returnKeyType="done"
            returnKeyLabel="done"
            serverErrors={this.state.server_errors}
            clearErrors={this.state.clearErrors}
            placeholderTextColor="#ababab"
          />
        )}

        <View style={{flexDirection:'row',flex:1,alignItems:'flex-end',marginBottom:30}}>
          <TouchableButton
            TouchableStyles={[Theme.Button.btnPrimary,{flex:10,marginRight:10}]}
            TextStyles={[Theme.Button.btnPrimaryText]}
            text="Send P1"
            onPress={() =>
              this.excequteTransaction()
            }
          />
          <TouchableButton
            TouchableStyles={[Theme.Button.btnPrimary,{flex:1}]}
            TextStyles={[Theme.Button.btnPrimaryText]}
            text="..."
            onPress={()=>{this.setState({transactionModal:true})}}
          />
        </View>


        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.transactionModal}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            this.setState({transactionModal :false})
          }}>
          <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            alignItems:'center',
            flex: 1,
          }}>

            <TouchableOpacity
              style={{borderColor:'#ffffff',borderWidth:2,borderRadius:25,height:35,width:35,backgroundColor:'transparent'}}>
              <Text style={{color:'#ffffff',textAlign:'center',fontSize:25,transform: [{ rotate: '45deg'}]}}>+</Text>
            </TouchableOpacity>

            <View style={{
              marginTop: 100,
              // flexDirection:'column',
              // flex: 1,
              width: Dimensions.get('window').width-20,
              backgroundColor:'#ffffff',
              height: 300,
              justifyContent:'center',
              padding:10
              // alignItems:'center'
            }}>


              <Text style={{textAlign:'center'}}>Enter The Amount your want to send</Text>
              <View style={{flexDirection:'column', flex:1}}>
                <FormInput
                  editable={true}
                  onKeyPress={(val) => this.onBtChange( val )}
                  placeholder="BT"
                  fieldName="bt_amount"
                  style={[Theme.TextInput.textInputStyle, this.state.password_error ? Theme.Errors.errorBorder : '', ]}
                  value= {`${this.state.btAmount}`}
                  returnKeyType="next"
                  returnKeyLabel="Next"
                  placeholderTextColor="#ababab"
                  errorMsg={this.state.pepo_amt_to_send_error}
                  serverErrors={this.state.server_errors}
                  clearErrors={this.state.clearErrors}
                  keyboardType = 'numeric'
                />
                <TextInput style={[Theme.TextInput.textInputStyle,{width: '25%'}]}><Text>PEPO</Text></TextInput>
              </View>

              <View style={{flexDirection:'row'}}>
                <FormInput
                  editable={true}
                  onKeyPress={(val) => this.onUSDChange( val ) }
                  placeholder="USD"
                  fieldName="usd_amount"
                  textContentType="none"
                  style={[Theme.TextInput.textInputStyle, this.state.password_error ? Theme.Errors.errorBorder : '',]}
                  returnKeyType="done"
                  returnKeyLabel="Done"
                  placeholderTextColor="#ababab"
                  serverErrors={this.state.server_errors}
                  clearErrors={this.state.clearErrors}
                  keyboardType = 'numeric'
                />
                <TextInput style={[Theme.TextInput.textInputStyle,{marginLeft:10}]}><Text>USD</Text></TextInput>
              </View>
              <TouchableButton
                TouchableStyles={[Theme.Button.btnPrimary]}
                TextStyles={[Theme.Button.btnPrimaryText]}
                text="CONFIRM"
                onPress={()=>{this.setState({transactionModal:true})}}
              />

            </View>
          </View>
        </Modal>
        <LoadingModal/>
      </View>
    );
  }
}

export default TransactionScreen;
