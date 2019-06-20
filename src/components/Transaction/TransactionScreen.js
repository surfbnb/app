import React, { Component } from 'react';
import { OstWalletSdk, OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import {
  View,
  Text,
  Alert,
  TextInput,
  Switch,
  TouchableOpacity,
  Modal,
  Image,
  Platform
} from 'react-native';

import TouchableButton from '../../theme/components/TouchableButton';
import FormInput from '../../theme/components/FormInput';
import Giphy from '../Giphy';
import Theme from '../../theme/styles';
import deepGet from 'lodash/get';
import PepoApi from '../../services/PepoApi';
import PriceOracle from '../../services/PriceOracle';
import currentUserModal from '../../models/CurrentUser';
import utilities from '../../services/Utilities';
import Store from '../../store';
import { showModal, hideModal } from '../../actions';
import appConfig from '../../constants/AppConfig';
import ExecuteTransactionWorkflow from '../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';
import inlineStyles from './Style';
import CircleCloseIcon from '../../assets/circle_close_icon.png';
import EditIcon from '../../assets/edit_icon.png';
import BackArrow from '../../assets/back-arrow.png';
import { ostErrors } from '../../services/OstErrors';
import pricer from "../../services/Pricer";

class TransactionScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: navigation.getParam('transactionHeader'),
      headerBackImage: <Image source={BackArrow} style={{ width: 10, height: 18, marginLeft: 8 }} />
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
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
      btAmountErrorMsg: null,
      feildErrorText: null
    };
    this.baseState = this.state;
    this.toUser = this.props.navigation.getParam('toUser');
  }

  defaultVals() {
    //TODO lets see how to optimise this
    this.meta = null;
    this.gify = null;
    this.priceOracle = null;
    this.workflow = null;
    this.previousState = null;
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
    pricer.getPriceOracleConfig( ostUserId , (token , pricePoints )=>{
      this.onGetPricePointSuccess(token, pricePoints);
      successCallback && successCallback(token , pricePoints );
    }, (error)=>{
      errorCallback && errorCallback(error);
    });
  }

  onGetPricePointSuccess(token, pricePoints) {
    let btUSDAmount = null;
    this.priceOracle = new PriceOracle(token, pricePoints);
    btUSDAmount = this.priceOracle.btToFiat(this.state.btAmount);
    this.setState({ btUSDAmount: btUSDAmount});
  }

  onGetPricePointError(error) {
    this.onError(error);
  }

  excequteTransaction() {
    if (!this.isValids()) {
      Alert.alert('', ostErrors.getUIErrorMessage('general_error_ex'));
      return;
    }
    Store.dispatch(showModal('Posting...'));
    this.setState({ feildErrorText: null });
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
      [this.toUser.ost_token_holder_address],
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

  onFlowInterrupt(ostWorkflowContext, error) {
    this.onError(error);
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
    this.props.navigation.goBack();
    this.props.navigation.navigate('Profile');
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

  onError(error) {
    Store.dispatch(hideModal());
    const errorMsg = ostErrors.getErrorMessage(error);
    if (errorMsg) {
      this.setState({ general_error: errorMsg });
      utilities.showAlert('', errorMsg);
      return;
    }
    const errorDataMsg = deepGet(error, 'err.error_data[0].msg');
    if (errorDataMsg) {
      this.setState({ feildErrorText: errorDataMsg });
      return;
    }
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

  onMessageBtnPress() {
    this.setState({ isMessageVisible: !this.state.isMessageVisible });
    if (this.state.isMessageVisible) {
      this.setState({ message: '' });
    }
  }

  onAmountModalConfrim() {
    let btAmount = this.state.btAmount;
    btAmount = btAmount && Number(btAmount);
    if (btAmount <= 0) {
      this.setState({ btAmountErrorMsg: ostErrors.getUIErrorMessage('bt_amount_error') });
      return;
    }
    this.setState({ transactionModal: false });
  }

  onAmountModalShow() {
    this.previousState = this.state;
    this.setState({ transactionModal: true });
  }

  onAmountModalClose() {
    this.setState(this.previousState);
  }

  render() {
    return (
      <View style={inlineStyles.container}>
       
        {/* {this.state.isLoading && (
          <React.Fragment>
            <ActivityIndicator />
          </React.Fragment>
        )} */}

        {!this.state.isLoading && (
          <React.Fragment>
            <Giphy
              onGifySelect={(gify) => {
                this.onGifySelect(gify);
              }}
            />

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignItems: 'center' }}
            >
              {/*{  This is add message button }*/}
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  this.onMessageBtnPress();
                }}
              >
                <Text style={inlineStyles.addMessageTextStyle}>
                  {this.state.isMessageVisible ? 'Clear Message' : 'Add Message'}
                </Text>
              </TouchableOpacity>

              {/* This is Share publically switch */}
              <View style={{ justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: '#606060' }}>Make Public</Text>
                  <Switch
                    value={this.state.isPublic}
                    style={inlineStyles.switchStyle}
                    onValueChange={(isPublic) => {
                      this.setState({ isPublic });
                    }}
                    ios_backgroundColor="#d3d3d3"
                    trackColor={{ true: '#EF5566', false: Platform.OS == 'android' ? '#d3d3d3' : '#ffffff' }}
                    thumbColor={[Platform.OS == 'android' ? '#ffffff' : '']}
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
                style={[Theme.TextInput.textInputStyle, { backgroundColor: '#ffffff', marginTop: 20 }]}
                value={this.state.message}
                returnKeyType="done"
                returnKeyLabel="done"
                serverErrors={this.state.server_errors}
                clearErrors={this.state.clearErrors}
                placeholderTextColor="#ababab"
              />
            )}

            <Text style={Theme.Errors.errorText}> {this.state.feildErrorText}</Text>

            <View style={inlineStyles.bottomButtonsWrapper}>
              <TouchableButton
                TouchableStyles={[Theme.Button.btnPink, inlineStyles.sendPepoBtn]}
                TextStyles={[Theme.Button.btnPinkText]}
                text={`Send P${this.state.btAmount}`}
                onPress={() => this.excequteTransaction()}
              />
              <TouchableOpacity
                style={[Theme.Button.btn, Theme.Button.btnPink, inlineStyles.dottedBtn]}
                onPress={() => {
                  this.onAmountModalShow();
                }}
              >
                <Image style={[{ width: 20, height: 20 }, { tintColor: '#ef5566' }]} source={EditIcon}></Image>
              </TouchableOpacity>
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
                <View style={inlineStyles.modelWrapper}>
                  <View>
                    <TouchableOpacity
                      style={inlineStyles.modalCloseBtnWrapper}
                      onPress={() => {
                        this.onAmountModalClose();
                      }}
                    >
                      <Image source={CircleCloseIcon} style={inlineStyles.crossIconSkipFont} />
                    </TouchableOpacity>
                  </View>
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
                          placeholderTextColor="#ababab"
                          errorMsg={this.state.btAmountErrorMsg}
                          serverErrors={this.state.server_errors}
                          clearErrors={this.state.clearErrors}
                          keyboardType="numeric"
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
                          style={Theme.TextInput.textInputStyle}
                          placeholderTextColor="#ababab"
                          serverErrors={this.state.server_errors}
                          clearErrors={this.state.clearErrors}
                          keyboardType="numeric"
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
                      TouchableStyles={[Theme.Button.btnPink, { marginTop: 10 }]}
                      TextStyles={[Theme.Button.btnPinkText]}
                      text="CONFIRM"
                      onPress={() => {
                        this.onAmountModalConfrim();
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </React.Fragment>
        )}
      </View>
    );
  }
}

export default TransactionScreen;
