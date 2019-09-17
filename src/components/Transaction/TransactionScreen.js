import React, { Component } from 'react';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  BackHandler,
  TouchableWithoutFeedback
} from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import BigNumber from 'bignumber.js';
import clone from 'lodash/clone';

import FormInput from '../../theme/components/FormInput';
import Theme from '../../theme/styles';
import tx_success from '../../assets/transaction_success.png';
import pepo_icon from '../../assets/pepo-tx-icon.png';
import deepGet from 'lodash/get';
import PepoApi from '../../services/PepoApi';
import CurrentUser from '../../models/CurrentUser';
import utilities from '../../services/Utilities';
import appConfig from '../../constants/AppConfig';
import ExecuteTransactionWorkflow from '../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';
import inlineStyles from './Style';
import { ostErrors } from '../../services/OstErrors';
import { ostSdkErrors, WORKFLOW_CANCELLED_MSG } from '../../services/OstSdkErrors';
import PriceOracle from '../../services/PriceOracle';
import pricer from '../../services/Pricer';
import reduxGetter from '../../services/ReduxGetters';
import PixelCall from '../../services/PixelCall';
import modalCross from '../../assets/modal-cross-icon.png';
import LinearGradient from 'react-native-linear-gradient';
import {ON_USER_CANCLLED_ERROR_MSG, ensureSession} from '../../helpers/TransactionHelper';

const bottomSpace = getBottomSpace([true]),
  extraPadding = 10,
  safeAreaBottomSpace = isIphoneX() ? bottomSpace : extraPadding;

const validMinAmount = 1;
const defaultBtAmount = 10;
const HEADER_TITLE = 'Send Pepos';
const SUCCESS_HEADER_TITLE = 'Sent';
const SUBMIT_BTN_TXT = 'Confirm';
const SUBMIT_PROCESSING_TXT = 'Confirming...';

class TransactionScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      gesturesEnabled: false
    };
  };
  constructor(props) {
    super(props);
    this.priceOracle = pricer.getPriceOracle();
    this.state = {
      balance: 0,
      exceBtnDisabled: true,
      general_error: '',
      btAmount: defaultBtAmount,
      fieldErrorText: null,
      btUSDAmount: (this.priceOracle && this.priceOracle.btToFiat(defaultBtAmount)) || 0,
      btAmountErrorMsg: null,
      bottomPadding: safeAreaBottomSpace,
      btFocus: false,
      usdFocus: false,
      inputFieldsEditable: true,
      closeDisabled: false,
      confirmBtnText: SUBMIT_BTN_TXT,
      headerText: HEADER_TITLE,
      showSuccess: false
    };
    this.toUser = reduxGetter.getUser(this.props.navigation.getParam('toUserId'));
    //Imp : Make sure if transaction is mappning againts Profile dont send video Id
    this.videoId = this.props.navigation.getParam('videoId');
    this.requestAcknowledgeDelegate = this.props.navigation.getParam('requestAcknowledgeDelegate');
    this.getBalance();
  }

  componentDidMount() {
    // default we need
    //this.setState({ btFocus: true });
  }

  _keyboardShown(e) {
    let bottomPaddingValue = deepGet(e, 'endCoordinates.height') || 350;
    bottomPaddingValue -= 60;
    if (this.state.usdFocus) {
      bottomPaddingValue = bottomPaddingValue - 60;
    }

    if (this.state.bottomPadding == bottomPaddingValue) {
      return;
    }

    this.setState({
      bottomPadding: bottomPaddingValue
    });
  }

  _keyboardHidden(e) {
    if (this.state.bottomPadding == safeAreaBottomSpace) {
      return;
    }
    this.setState({
      bottomPadding: safeAreaBottomSpace
    });
  }

  onBtChange(bt) {
    if (!this.priceOracle) return;
    this.setState({ btAmount: bt, btUSDAmount: this.priceOracle.btToFiat(bt) });
    this.clearFieldErrors();
  }

  clearFieldErrors() {
    if (this.state.btAmount > 0) {
      this.setState({ btAmountErrorMsg: null });
    }
  }

  onUSDChange(usd) {
    if (!this.priceOracle) return;
    this.setState({ btAmount: this.priceOracle.fiatToBt(usd), btUSDAmount: usd });
    this.clearFieldErrors();
  }

  onConfirm = () => {
    let btAmount = this.state.btAmount;
    if (!this.isValidInput(btAmount)) {
      return;
    }
    this.setState({
      general_error: ''
    });
    this.excecuteTransaction();
  };

  isValidInput(btAmount) {
    if (btAmount && String(btAmount).indexOf(',') > -1) {
      this.setState({ btAmountErrorMsg: ostErrors.getUIErrorMessage('bt_amount_decimal_error') });
      return false;
    }
    if (btAmount && String(btAmount).split('.')[1] && String(btAmount).split('.')[1].length > 2) {
      this.setState({ btAmountErrorMsg: ostErrors.getUIErrorMessage('bt_amount_decimal_allowed_error') });
      return false;
    }
    btAmount = btAmount && Number(btAmount);
    if (!btAmount || btAmount < validMinAmount || btAmount > this.state.balance) {
      this.setState({ btAmountErrorMsg: ostErrors.getUIErrorMessage('bt_amount_error') });
      return false;
    }
    return true;
  }

  closeModal() {
    this.setState({ btFocus: false, usdFocus: false }, () => {
      this.props.navigation.goBack();
    });
  }

  defaultVals() {
    this.meta = null;
    this.workflow = null;
  }

  componentWillMount() {
    this.defaultVals();
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShown.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardHidden.bind(this));

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShown.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHidden.bind(this));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    this.defaultVals();
    this.onGetPricePointSuccess = () => {};
    this.onBalance = () => {};
    this.onTransactionSuccess = () => {};
    this.onError = () => {};
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    if (this.state.closeDisabled) {
      return true;
    }
  };

  getBalance() {
    pricer.getBalance(
      (res) => {
        this.onBalance(res);
      },
      (err, context) => {
        this.onError(err, context);
      }
    );
  }

  //TODO , NOT SURE if bug comes this also will have to connected via redux.
  onBalance(balance, res) {
    balance = pricer.getFromDecimal(balance);
    balance = Number(PriceOracle.toBt(balance)) || 0;
    let exceBtnDisabled =
      BigNumber(balance).isLessThan(validMinAmount) ||
      !utilities.isUserActivated(reduxGetter.getUserActivationStatus(this.toUser.id));
    this.setState({ balance, exceBtnDisabled });
  }

  excecuteTransaction() {
    this.setState({
      fieldErrorText: null,
      exceBtnDisabled: true,
      inputFieldsEditable: false,
      backDropClickDisabled: true,
      confirmBtnText: SUBMIT_PROCESSING_TXT,
      closeDisabled: true
    });
    this.sendTransactionToSdk();
  }

  sendTransactionToSdk() {
    const user = CurrentUser.getUser();
    // const option = { wait_for_finalization: false };
    const btInDecimal = pricer.getToDecimal(this.state.btAmount);
    ensureSession(user.ost_user_id, btInDecimal, (errorMessage, success) => {
      if ( success ) {
        return this._executeTransaction(user, btInDecimal);
      }

      if ( errorMessage ) {
        if ( ON_USER_CANCLLED_ERROR_MSG === errorMessage || WORKFLOW_CANCELLED_MSG === errorMessage ) {
          //Cancel the flow.
          this.resetState();
          return;
        }

        // Else: Show the error message.
        this.showError( errorMessage );

      }
    });
  }

  _executeTransaction(user, btInDecimal) {
    this.workflow = new ExecuteTransactionWorkflow(this);
    OstWalletSdk.executeTransaction(
      user.ost_user_id,
      [this.toUser.ost_token_holder_address],
      [btInDecimal],
      appConfig.ruleTypeMap.directTransfer,
      this.getSdkMetaProperties(),
      this.workflow
    );
  }

  getSdkMetaProperties() {
    let details = '';
    const metaProperties = clone(appConfig.metaProperties);
    if (this.videoId) {
      metaProperties['name'] = 'video';
      details = `vi_${this.videoId} `;
    }
    details += `ipp_${1}`;
    metaProperties['details'] = details;
    return metaProperties;
  }

  onRequestAcknowledge(ostWorkflowContext, ostWorkflowEntity) {
    pricer.getBalance();
    this.sendTransactionToPlatform(ostWorkflowContext, ostWorkflowEntity);
    this.dropPixel();
  }

  dropPixel() {
    let pixelParams = {
      e_action: 'contribution',
      e_data_json: {
        profile_user_id: this.toUser.id,
        amount: this.state.btAmount
      }
    };
    if (this.videoId) {
      pixelParams.e_entity = 'video';
      pixelParams.e_data_json.video_id = this.videoId;
      pixelParams.p_type = 'feed';
    } else {
      pixelParams.e_entity = 'user_profile';
      pixelParams.p_type = 'user_profile';
    }
    PixelCall(pixelParams);
  }

  onFlowInterrupt(ostWorkflowContext, error) {
    pricer.getBalance();
    this.onError(error, ostWorkflowContext);
  }

  sendTransactionToPlatform(ostWorkflowContext, ostWorkflowEntity) {
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
      })
      .finally(() => {
        this.requestAcknowledgeDelegate && this.requestAcknowledgeDelegate(ostWorkflowContext, ostWorkflowEntity);
      });
  }

  onTransactionSuccess(res) {
    setTimeout(() => {
      this.setState({
        headerText: SUCCESS_HEADER_TITLE,
        showSuccess: true,
        general_error: ''
      });
      this.resetState();
    }, 300);
  }

  resetState() {
    this.setState({
      btFocus: false,
      usdFocus: false,
      exceBtnDisabled: false,
      confirmBtnText: 'CONFIRM',
      inputFieldsEditable: true,
      closeDisabled: false
    });
  }

  getSendTransactionPlatformData(ostWorkflowEntity) {
    let params = {
      ost_transaction: deepGet(ostWorkflowEntity, 'entity'),
      ost_transaction_uuid: deepGet(ostWorkflowEntity, 'entity.id')
    };
    if (this.videoId) {
      params['meta'] = {};
      params['meta']['vi'] = this.videoId;
    }
    return params;
  }

  onError(error, ostWorkflowContext) {

    if ( ostWorkflowContext ) {
      // workflow error.
      const errorMsg = ostSdkErrors.getErrorMessage(ostWorkflowContext, error) ;
      this.showError( errorMsg );
      return;
    }

    const errorMsg = ostErrors.getErrorMessage(error);
    if (errorMsg) {
      this.showError( errorMsg );
      return;
    }
    const errorDataMsg = deepGet(error, 'err.error_data[0].msg');
    if (errorDataMsg) {
      this.showError( errorDataMsg );
      return;
    }
  }

  showError( errorMessage ) {
    this.resetState();
    this.setState({ general_error: errorMessage });
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPressOut={() => {
          if (!this.state.closeDisabled) {
            this.closeModal();
          }
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <TouchableWithoutFeedback>
            <View style={[inlineStyles.container, { paddingBottom: this.state.bottomPadding }]}>
              <View style={inlineStyles.headerWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    this.closeModal();
                  }}
                  style={inlineStyles.crossIconWrapper}
                  disabled={this.state.closeDisabled}
                >
                  <Image source={modalCross} style={inlineStyles.crossIconSkipFont} />
                </TouchableOpacity>
                <Text style={inlineStyles.modalHeader}>{this.state.headerText}</Text>
              </View>
              {!this.state.showSuccess && (
                <View style={{ padding: 20 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.7 }}>
                      <FormInput
                        editable={this.state.inputFieldsEditable}
                        onChangeText={(val) => this.onBtChange(val)}
                        placeholder="BT"
                        fieldName="bt_amount"
                        style={Theme.TextInput.textInputStyle}
                        value={`${this.state.btAmount}`}
                        placeholderTextColor="#ababab"
                        errorMsg={this.state.btAmountErrorMsg}
                        keyboardType="numeric"
                        isFocus={this.state.btFocus}
                        blurOnSubmit={true}
                      />
                    </View>
                    <View style={{ flex: 0.3 }}>
                      <TextInput
                        editable={false}
                        style={[Theme.TextInput.textInputStyle, inlineStyles.editableTextInput]}
                      >
                        <Text>PEPO</Text>
                      </TextInput>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.7 }}>
                      <FormInput
                        editable={this.state.inputFieldsEditable}
                        onChangeText={(val) => this.onUSDChange(val)}
                        value={`${this.state.btUSDAmount}`}
                        placeholder="USD"
                        fieldName="usd_amount"
                        style={Theme.TextInput.textInputStyle}
                        placeholderTextColor="#ababab"
                        keyboardType="numeric"
                        blurOnSubmit={true}
                        isFocus={this.state.usdFocus}
                        onFocus={() =>
                          this.setState({
                            usdFocus: true
                          })
                        }
                        onBlur={() =>
                          this.setState({
                            usdFocus: false
                          })
                        }
                      />
                    </View>
                    <View style={{ flex: 0.3 }}>
                      <TextInput
                        editable={false}
                        style={[Theme.TextInput.textInputStyle, inlineStyles.editableTextInput]}
                      >
                        <Text>USD</Text>
                      </TextInput>
                    </View>
                  </View>

                  <LinearGradient
                    colors={['#ff7499', '#ff5566']}
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ marginTop: 25, borderRadius: 3 }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.onConfirm();
                      }}
                      disabled={this.state.exceBtnDisabled}
                      style={[Theme.Button.btn, { borderWidth: 0 }]}
                    >
                      <Text
                        style={[
                          Theme.Button.btnPinkText,
                          { fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center' }
                        ]}
                      >
                        {this.state.confirmBtnText}
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>

                  <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 13 }}>
                    Your Current Balance: <Image style={{ width: 10, height: 10 }} source={pepo_icon}></Image>{' '}
                    {this.state.balance}
                  </Text>
                  <Text style={[{ textAlign: 'center', marginTop: 10 }, Theme.Errors.errorText]}>
                    {this.state.general_error}
                  </Text>
                </View>
              )}
              {this.state.showSuccess && (
                <View
                  style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 40, backgroundColor: '#fbfbfb' }}
                >
                  <Image source={tx_success} style={{ width: 164.6, height: 160, marginBottom: 20 }}></Image>
                  <Text style={{ textAlign: 'center', fontFamily: 'AvenirNext-Regular', fontSize: 16 }}>
                    Success, you have sent {this.toUser.name} {this.state.btAmount} Pepos
                  </Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default TransactionScreen;
