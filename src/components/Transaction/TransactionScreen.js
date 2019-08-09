import React, { Component } from 'react';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard } from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import BigNumber from 'bignumber.js';
import clone from 'lodash/clone';

import FormInput from '../../theme/components/FormInput';
import TouchableButton from '../../theme/components/TouchableButton';
import Theme from '../../theme/styles';
import pepo_icon from '../../assets/pepo-blue-icon.png';
import deepGet from 'lodash/get';
import PepoApi from '../../services/PepoApi';
import CurrentUser from '../../models/CurrentUser';
import utilities from '../../services/Utilities';
import { LoadingModal } from '../../theme/components/LoadingModalCover';
import appConfig from '../../constants/AppConfig';
import ExecuteTransactionWorkflow from '../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';
import inlineStyles from './Style';
import { ostErrors } from '../../services/OstErrors';
import PriceOracle from '../../services/PriceOracle';
import pricer from '../../services/Pricer';
import reduxGetter from '../../services/ReduxGetters';
import PixelCall from '../../services/PixelCall';
import modalCross from '../../assets/modal-cross-icon.png';

const bottomSpace = getBottomSpace([true]),
  extraPadding = 10,
  safeAreaBottomSpace = isIphoneX() ? bottomSpace : extraPadding;

class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.priceOracle = pricer.getPriceOracle();
    this.state = {
      balance: 0,
      exceBtnDisabled: true,
      general_error: '',
      btAmount: 1,
      fieldErrorText: null,
      btUSDAmount: (this.priceOracle && this.priceOracle.btToFiat(1)) || 0,
      btAmountErrorMsg: null,
      bottomPadding: safeAreaBottomSpace,
      btFocus: false
    };
    this.toUser = reduxGetter.getUser(this.props.navigation.getParam('toUserId'));
    //Imp : Make sure if transaction is mappning againts Profile dont send video Id
    this.videoId = this.props.navigation.getParam('videoId');
    this.requestAcknowledgeDelegate = this.props.navigation.getParam('requestAcknowledgeDelegate');
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
    if (bt > 0) {
      this.setState({ btAmountErrorMsg: null });
    }
  }

  onUSDChange(usd) {
    if (!this.priceOracle) return;
    this.setState({ btAmount: this.priceOracle.fiatToBt(usd), btUSDAmount: usd });
  }

  onConfirm = () => {
    let btAmount = this.state.btAmount;
    if (!this.isValidInput(btAmount)) {
      return;
    }
    btAmount = btAmount && Number(btAmount);
    this.onAmountModalConfirm(this.state.btAmount, this.state.btUSDAmount);
    this.closeModal();
  };

  isValidInput(btAmount) {
    if (btAmount && String(btAmount).indexOf(',') > -1) {
      this.setState({ btAmountErrorMsg: ostErrors.getUIErrorMessage('bt_amount_decimal_error') });
      return false;
    }
    btAmount = btAmount && Number(btAmount);
    if (!btAmount || btAmount <= 0 || btAmount > this.state.balance) {
      this.setState({ btAmountErrorMsg: ostErrors.getUIErrorMessage('bt_amount_error') });
      return false;
    }
    return true;
  }

  closeModal() {
    this.setState({ btFocus: false }, () => {
      this.props.navigation.goBack();
    });
  }

  defaultVals() {
    this.meta = null;
    this.workflow = null;
  }

  componentWillMount() {
    this.defaultVals();
    this.getBalance();
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShown.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardHidden.bind(this));

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShown.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHidden.bind(this));
  }

  componentWillUnmount() {
    this.defaultVals();
    this.onGetPricePointSuccess = () => {};
    this.onBalance = () => {};
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

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
      !BigNumber(balance).isGreaterThan(0) ||
      !utilities.isUserActivated(reduxGetter.getUserActivationStatus(this.toUser.id));
    this.setState({ balance, exceBtnDisabled });
  }

  excecuteTransaction() {
    LoadingModal.show('Posting', 'This may take a while,\n we are surfing on Blockchain');
    this.setState({ fieldErrorText: null });
    this.sendTransactionToSdk();
  }

  sendTransactionToSdk() {
    const user = CurrentUser.getUser();
    //const option = { wait_for_finalization: false };
    const btInDecimal = pricer.getToDecimal(this.state.btAmount);
    this.workflow = new ExecuteTransactionWorkflow(this);
    OstWalletSdk.executeTransaction(
      user.ost_user_id,
      [this.toUser.ost_token_holder_address],
      [btInDecimal],
      appConfig.ruleTypeMap.directTransfer,
      this.getSdkMetaProperties(),
      this.workflow
      //,option
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
    this.requestAcknowledgeDelegate && this.requestAcknowledgeDelegate(ostWorkflowContext, ostWorkflowEntity);
    pricer.getBalance();
    this.sendTransactionToPlatform(ostWorkflowEntity);
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
    LoadingModal.hide();
    this.props.navigation.goBack();
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
    LoadingModal.hide();
    const errorMsg = ostErrors.getErrorMessage(error);
    if (errorMsg) {
      this.setState({ general_error: errorMsg });
      utilities.showAlert('', errorMsg);
      return;
    }
    const errorDataMsg = deepGet(error, 'err.error_data[0].msg');
    if (errorDataMsg) {
      this.setState({ fieldErrorText: errorDataMsg });
      return;
    }
  }

  onAmountModalConfirm = (btAmt, btUSDAmt) => {
    this.setState({
      btAmount: btAmt,
      btUSDAmount: btUSDAmt
    });
  };

  render() {
    return (
      <View style={[inlineStyles.container, { paddingBottom: this.state.bottomPadding }]}>
        <View style={inlineStyles.headerWrapper}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={{
              position: 'absolute',
              left: 15
            }}
          >
            <Image source={modalCross} style={{ width: 19.5, height: 19 }} />
          </TouchableOpacity>
          <Text style={inlineStyles.modalHeader}>Send Pepo’s</Text>
        </View>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 0.7 }}>
              <FormInput
                editable={true}
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
                editable={true}
                onChangeText={(val) => this.onUSDChange(val)}
                value={`${this.state.btUSDAmount}`}
                placeholder="USD"
                fieldName="usd_amount"
                style={Theme.TextInput.textInputStyle}
                placeholderTextColor="#ababab"
                keyboardType="numeric"
                blurOnSubmit={true}
              />
            </View>
            <View style={{ flex: 0.3 }}>
              <TextInput editable={false} style={[Theme.TextInput.textInputStyle, inlineStyles.nonEditableTextInput]}>
                <Text>USD</Text>
              </TextInput>
            </View>
          </View>
          <TouchableButton
            disabled={this.state.exceBtnDisabled}
            TouchableStyles={[Theme.Button.btnPink, { marginTop: 10 }]}
            TextStyles={[Theme.Button.btnPinkText]}
            text="CONFIRM"
            onPress={() => {
              this.onConfirm();
            }}
          />
          <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 13 }}>
            Your Current Balance: <Image style={{ width: 10, height: 10 }} source={pepo_icon}></Image>{' '}
            {this.state.balance}
          </Text>
        </View>
      </View>
    );
  }
}

export default TransactionScreen;
