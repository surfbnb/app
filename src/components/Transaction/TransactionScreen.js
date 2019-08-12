import React, { Component } from 'react';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard, BackHandler } from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import BigNumber from 'bignumber.js';
import clone from 'lodash/clone';

import FormInput from '../../theme/components/FormInput';
import TouchableButton from '../../theme/components/TouchableButton';
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
import PriceOracle from '../../services/PriceOracle';
import pricer from '../../services/Pricer';
import reduxGetter from '../../services/ReduxGetters';
import PixelCall from '../../services/PixelCall';
import modalCross from '../../assets/modal-cross-icon.png';
import LinearGradient from 'react-native-linear-gradient';

const bottomSpace = getBottomSpace([true]),
  extraPadding = 10,
  safeAreaBottomSpace = isIphoneX() ? bottomSpace : extraPadding;

const validMinAmount = 1;

class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.priceOracle = pricer.getPriceOracle();
    this.state = {
      balance: 0,
      exceBtnDisabled: true,
      general_error: '',
      btAmount: validMinAmount,
      fieldErrorText: null,
      btUSDAmount: (this.priceOracle && this.priceOracle.btToFiat(validMinAmount)) || 0,
      btAmountErrorMsg: null,
      bottomPadding: safeAreaBottomSpace,
      btFocus: false,
      usdFocus: false,
      inputFieldsEditable: true,
      closeDisabled: false,
      confirmBtnText: 'CONFIRM',
      headerText: 'Send Pepo’s',
      showSuccess: false
    };
    this.toUser = reduxGetter.getUser(this.props.navigation.getParam('toUserId'));
    //Imp : Make sure if transaction is mappning againts Profile dont send video Id
    this.videoId = this.props.navigation.getParam('videoId');
    this.requestAcknowledgeDelegate = this.props.navigation.getParam('requestAcknowledgeDelegate');
    this.getBalance();
  }

  componentDidMount() {
    this.setState({ btFocus: true });
  }

  _keyboardShown(e) {
    let bottomPaddingValue = deepGet(e, 'endCoordinates.height') || 350;
    bottomPaddingValue += extraPadding;

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
    this.excecuteTransaction();
  };

  isValidInput(btAmount) {
    if (btAmount && String(btAmount).indexOf(',') > -1) {
      this.setState({ btAmountErrorMsg: ostErrors.getUIErrorMessage('bt_amount_decimal_error') });
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
      (err) => {
        this.onError(err);
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
      confirmBtnText: 'CONFIRMING...',
      closeDisabled: true
    });
    this.sendTransactionToSdk();
  }

  sendTransactionToSdk() {
    const user = CurrentUser.getUser();
    const btInDecimal = pricer.getToDecimal(this.state.btAmount);
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
    const metaProperties = clone(appConfig.metaProperties);
    if (this.videoId) {
      metaProperties['name'] = 'video';
      metaProperties['details'] = `vi_${this.videoId}`;
    }
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
    this.onError(error);
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
      //TODO Create success screen , and bt or usd focus off
      //Revert all disabled states
      //Change navigation header
      this.setState({
        headerText: 'Sent',
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
    return {
      ost_transaction: deepGet(ostWorkflowEntity, 'entity'),
      ost_transaction_uuid: deepGet(ostWorkflowEntity, 'entity.id'),
      meta: {
        vi: this.videoId
      }
    };
  }

  onError(error) {
    const errorMsg = ostErrors.getErrorMessage(error);
    if (errorMsg) {
      //TODO map to UI
      this.setState({ general_error: errorMsg });
      this.resetState();
      return;
    }
    const errorDataMsg = deepGet(error, 'err.error_data[0].msg');
    if (errorDataMsg) {
      this.setState({ fieldErrorText: errorDataMsg });
      return;
    }
  }

  render() {
    return (
      <View style={[inlineStyles.container, { paddingBottom: this.state.bottomPadding }]}>
        <View style={inlineStyles.headerWrapper}>
          <TouchableOpacity
            onPress={() => {
              this.closeModal();
            }}
            style={{
              position: 'absolute',
              left: 10,
              width: 50,
              height: 50,
              // alignItems: 'center',
              justifyContent: 'center'
            }}
            disabled={this.state.closeDisabled}
          >
            <Image source={modalCross} style={{ width: 13, height: 12.6 }} />
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
                <TextInput editable={false} style={[Theme.TextInput.textInputStyle, inlineStyles.nonEditableTextInput]}>
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
                  ref="usdInput"
                />
              </View>
              <View style={{ flex: 0.3 }}>
                <TextInput editable={false} style={[Theme.TextInput.textInputStyle, inlineStyles.nonEditableTextInput]}>
                  <Text>USD</Text>
                </TextInput>
              </View>
            </View>
            <LinearGradient
              colors={['#ff7499', '#ff5566']}
              locations={[0, 1]}
              style={{ marginHorizontal: 35, borderRadius: 3 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableButton
                disabled={this.state.exceBtnDisabled}
                TouchableStyles={[Theme.Button.btnPink]}
                TextStyles={[Theme.Button.btnPinkText]}
                text={this.state.confirmBtnText}
                onPress={() => {
                  this.onConfirm();
                }}
              />
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
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 30, paddingHorizontal: 50 }}>
            <Image source={tx_success} style={{ width: 200, height: 200 }}></Image>
            <Text style={{ textAlign: 'center' }}>
              Success, you have sent {this.toUser.name} {this.state.btAmount} Pepo’s
            </Text>
          </View>
        )}
      </View>
    );
  }
}

export default TransactionScreen;
