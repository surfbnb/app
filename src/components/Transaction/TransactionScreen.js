import React, { Component } from 'react';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import { View, Text, Alert, TextInput, Switch, TouchableOpacity, Dimensions, Modal } from 'react-native';
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
import inlineStyles from './Style';
class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      clearErrors: false,
      server_errors: null,
      isPublic: true,
      general_error: '',
      btAmount: 1,
      btUSDAmount: null,
      isMessageVisible: false,
      switchToggleState: false,
      transactionModal: false,
      btAmountFocus: true,
      btUSDAmountFocus: false
    };
    this.baseState = this.state;
  }

  defaultVals() {
    //TODO lets see how to optimise this
    this.meta = null;
    this.gify = null;
    this.priceOracle = null;
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
    let btUSDAmount = null;
    this.priceOracle = new PriceOracle(this.getPriceOracleConfig(token, res));
    btUSDAmount = this.priceOracle.btToFiat(this.state.btAmount);
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
    const btInDecimal = this.priceOracle.toDecimal(this.state.btAmount);
    this.workflow = new ExecuteTransactionWorkflow(this);
    OstWalletSdk.executeTransaction(
      user.ost_user_id,
      [user.ost_token_holder_address],
      [btInDecimal],
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
    return this.state.isPublic
      ? appConfig.executeTransactionPrivacyType.public
      : appConfig.executeTransactionPrivacyType.private;
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
  }

  onBtChange(bt) {
    const usd = this.priceOracle.btToFiat(bt);
    this.setState({ btAmount: bt, btUSDAmount: usd });
  }

  onUSDChange(usd) {
    const bt = this.priceOracle.fiatToBt(usd);
    this.setState({ btAmount: bt, btUSDAmount: usd });
  }

  getPriceOracleConfig(token, res) {
    const conversionFactor = deepGet(token, 'conversion_factor');
    const decimal = deepGet(token, 'decimals');
    const usdPricePoint = deepGet(res, 'price_point.OST.USD');
    return {
      conversionFactor: conversionFactor,
      usdPricePoint: usdPricePoint,
      decimal: decimal
    };
  }

  onMessageBtnPress() {
    this.setState({ isMessageVisible: !this.state.isMessageVisible });
    if (!this.state.isMessageVisible) {
      this.setState({ message: '' });
    }
  }

  render() {
    return (
      <View style={inlineStyles.container}>
        <Giphy
          onGifySelect={(gify) => {
            this.onGifySelect(gify);
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/*{  This is add message button }*/}
          <TouchableOpacity
            style={{}}
            onPress={() => {
              this.onMessageBtnPress();
            }}
          >
            <Text style={inlineStyles.addMessageTextStyle}>
              {this.state.isMessageVisible ? '-Clear Message' : '+Add Message'}
            </Text>
          </TouchableOpacity>

          {/* This is Share publically switch */}
          <View style={{ justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>Share Public</Text>
              <Switch
                value={this.state.isPublic}
                style={inlineStyles.switchStyle}
                onValueChange={(isPublic) => {
                  this.setState({ isPublic });
                }}
                thumbColor="#EF5566"
                trackColor={{ false: '#ffffff', true: '#EF5566' }}
              ></Switch>
            </View>
          </View>
        </View>

        {this.state.isMessageVisible && (
          <FormInput
            autoFocus={true}
            editable={true}
            onChangeText={(message) => this.setState({ message: message })}
            placeholder="Message"
            fieldName="message"
            style={[Theme.TextInput.textInputStyle, { backgroundColor: '#ffffff' }]}
            value={this.state.message}
            returnKeyType="done"
            returnKeyLabel="done"
            serverErrors={this.state.server_errors}
            clearErrors={this.state.clearErrors}
            placeholderTextColor="#ababab"
          />
        )}

        <View style={inlineStyles.bottomButtonsWrapper}>
          <TouchableButton
            TouchableStyles={[Theme.Button.btnPrimary, inlineStyles.sendPepoBtn]}
            TextStyles={[Theme.Button.btnPrimaryText]}
            text={`Send P${this.state.btAmount}`}
            onPress={() => this.excequteTransaction()}
          />
          <TouchableButton
            TouchableStyles={[Theme.Button.btnPrimary, inlineStyles.dottedBtn]}
            TextStyles={[Theme.Button.btnPrimaryText]}
            text="..."
            onPress={() => {
              this.setState({ transactionModal: true });
            }}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.transactionModal}
          onRequestClose={() => {
            this.setState({ transactionModal: false });
          }}
        >
          <View style={inlineStyles.modalBackDrop}>
            <TouchableOpacity
              style={inlineStyles.modalCloseBtnWrapper}
              onPress={() => {
                this.setState({ transactionModal: false });
              }}
            >
              <Text style={inlineStyles.modalCloseBtnContent}>+</Text>
            </TouchableOpacity>

            <View style={inlineStyles.modalContentWrapper}>
              <Text style={inlineStyles.modalHeader}>Enter The Amount your want to send</Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 0.7 }}>
                  <FormInput
                    editable={true}
                    onChangeText={(val) => this.onBtChange(val)}
                    placeholder="BT"
                    fieldName="bt_amount"
                    style={Theme.TextInput.textInputStyle}
                    value={`${this.state.btAmount}`}
                    returnKeyType="next"
                    returnKeyLabel="Next"
                    placeholderTextColor="#ababab"
                    errorMsg={this.state.pepo_amt_to_send_error}
                    serverErrors={this.state.server_errors}
                    clearErrors={this.state.clearErrors}
                    keyboardType="numeric"
                    onSubmitEditing={() => {
                      this.setState({
                        btUSDAmountFocus: true,
                        btAmountFocus: false
                      });
                    }}
                    isFocus={this.state.btAmountFocus}
                    blurOnSubmit={false}
                  />
                </View>
                <View style={{ flex: 0.3 }}>
                  <TextInput
                    editable={false}
                    style={[Theme.TextInput.textInputStyle, inlineStyles.nonEditableTextInput]}
                  >
                    <Text>PEPO</Text>
                  </TextInput>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 0.7 }}>
                  <FormInput
                    editable={true}
                    onChangeText={(val) => this.onUSDChange(val)}
                    value={`${this.state.btUSDAmount}`}
                    placeholder="USD"
                    fieldName="usd_amount"
                    textContentType="none"
                    style={[Theme.TextInput.textInputStyle, this.state.password_error ? Theme.Errors.errorBorder : '']}
                    returnKeyType="done"
                    returnKeyLabel="Done"
                    placeholderTextColor="#ababab"
                    serverErrors={this.state.server_errors}
                    clearErrors={this.state.clearErrors}
                    keyboardType="numeric"
                    onSubmitEditing={() => {
                      this.setState({
                        btUSDAmountFocus: false,
                        transactionModal: false
                      });
                    }}
                    isFocus={this.state.btUSDAmountFocus}
                    blurOnSubmit={true}
                  />
                </View>
                <View style={{ flex: 0.3 }}>
                  <TextInput
                    editable={false}
                    style={[Theme.TextInput.textInputStyle, inlineStyles.nonEditableTextInput]}
                  >
                    <Text>USD</Text>
                  </TextInput>
                </View>
              </View>
              <TouchableButton
                TouchableStyles={[Theme.Button.btnPink]}
                TextStyles={[Theme.Button.btnPinkText]}
                text="CONFIRM"
                onPress={() => {
                  this.setState({ transactionModal: false });
                }}
              />
            </View>
          </View>
        </Modal>
        <LoadingModal />
      </View>
    );
  }
}

export default TransactionScreen;
