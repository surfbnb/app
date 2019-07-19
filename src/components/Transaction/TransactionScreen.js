import React, { Component } from 'react';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { View, Text, Alert, Switch, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {Header, SafeAreaView} from 'react-navigation';
import BigNumber from 'bignumber.js';
import clone from "lodash/clone";

import FormInput from '../../theme/components/FormInput';
import Theme from '../../theme/styles';
import deepGet from 'lodash/get';
import PepoApi from '../../services/PepoApi';
import currentUserModal from '../../models/CurrentUser';
import utilities from '../../services/Utilities';
import { LoadingModal } from '../../theme/components/LoadingModalCover';
import appConfig from '../../constants/AppConfig';
import ExecuteTransactionWorkflow from '../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';
import inlineStyles from './Style';
import EditIcon from '../../assets/edit_icon.png';
import BackArrow from "../CommonComponents/BackArrow";
import { ostErrors } from '../../services/OstErrors';
import PriceOracle from '../../services/PriceOracle';
import pricer from '../../services/Pricer';
import GiphySelect from "./GiphySelect";

import reduxGetter from "../../services/ReduxGetters";


const safeAreaHeight = Header.HEIGHT + getStatusBarHeight([true]) + getBottomSpace([true]);

class TransactionScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: reduxGetter.getName( navigation.getParam('toUserId') ) ,
      headerBackImage: (<BackArrow/>)
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      exceBtnDisabled: true,
      isLoading: false,
      message: null,
      server_errors: null,
      isPublic: true,
      general_error: '',
      btAmount: 1,
      btUSDAmount: 0,
      isMessageVisible: false,
      switchToggleState: false,
      showTxModal: false,
      fieldErrorText: null,
      viewStyle: { height: Dimensions.get('window').height - safeAreaHeight },
      selectedGiphy: null
    };
    this.baseState = this.state;
    this.toUser = reduxGetter.getUser( this.props.navigation.getParam('toUserId') ) ;
    //Imp : Make sure if transaction is mappning againts Profile dont send video Id
    this.videoId = this.props.navigation.getParam('videoId');
    this.requestAcknowledgeDelegate = this.props.navigation.getParam('requestAcknowledgeDelegate')
  }

  defaultVals() {
    this.meta = null;
    this.workflow = null;
  }

  componentWillMount() {
    this.defaultVals();
    this.getBalance();

  }

  componentWillUnmount() {
    this.defaultVals();
    this.onGetPricePointSuccess = () => {};
    this.onBalance = () => {};
  }

  getBalance() {
    pricer.getBalance( 
      (res) => {
      this.onBalance(res);
      },
      (err) => {
        this.onError( err );
    });
  }

  //TODO , NOT SURE if bug comes this also will have to connected via redux.
  onBalance(balance , res) {
    balance = pricer.getFromDecimal(balance);
    balance = PriceOracle.toBt(balance) || 0;
    let exceBtnDisabled = !BigNumber(balance).isGreaterThan(0);
    this.setState({ balance, exceBtnDisabled });
  }

  excecuteTransaction() {
    LoadingModal.show('Posting', 'This may take a while,\n we are surfing on Blockchain');
    this.setState({ fieldErrorText: null });
    this.sendTransactionToSdk();
  }

  sendTransactionToSdk() {
    const user = currentUserModal.getUser();
    const option = { wait_for_finalization: false };
    const btInDecimal = pricer.getToDecimal(this.state.btAmount);
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
    if(this.videoId){
      metaProperties["name"] = "video"; 
      metaProperties["details"] =  `vi_${this.videoId}`;
    }
    return metaProperties; 
  }

  onRequestAcknowledge(ostWorkflowContext, ostWorkflowEntity) {
    this.requestAcknowledgeDelegate && this.requestAcknowledgeDelegate(ostWorkflowContext , ostWorkflowEntity) ;
    pricer.getBalance(); 
    this.sendTransactionToPlatform(ostWorkflowEntity);
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
      privacy_type: this.getPrivacyType(),
      meta: {
        text: this.state.message,
        giphy: this.state.selectedGiphy,
        vi: this.videoId
      }
    };
  }

  getPrivacyType() {
    return this.state.isPublic
      ? appConfig.executeTransactionPrivacyType.public
      : appConfig.executeTransactionPrivacyType.private;
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

  onMessageBtnPress() {
    this.setState({ isMessageVisible: !this.state.isMessageVisible });
    if (this.state.isMessageVisible) {
      this.setState({ message: '' });
    }
  }

  onAmountModalConfirm = (btAmt, btUSDAmt) => {
    this.setState({
      btAmount: btAmt,
      btUSDAmount: btUSDAmt
    });
  };

  openedKeyboard(frames) {
    let deviceHeight = frames.endCoordinates.screenY -  Header.HEIGHT - getStatusBarHeight(),
      stateObj;
    if (deviceHeight > 362) {
      stateObj = { height: deviceHeight };
    } else {
      stateObj = { flex: 1 };
    }
    this.setState({
      viewStyle: stateObj
    });
  }

  closedKeyboard(frames) {
    this.setState({
      viewStyle: { height: Dimensions.get('window').height - safeAreaHeight }
    });
  }

  openGiphy() {
    this.props.navigation.navigate('Giphy', { onGifySelect: ( gifsData )=> {
       this.setState({ selectedGiphy: gifsData});
    }})
  }

  openEditTx(){
    this.props.navigation.navigate('EditTx', {
      btAmount: this.state.btAmount,
      balance: this.state.balance,
      onAmountModalConfirm: this.onAmountModalConfirm
    })
  }

  resetGiphy(){
    this.setState({ selectedGiphy: null});
  }

  render() {
    return (
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={200}
        style={{backgroundColor: '#f6f6f6'}}
        onKeyboardWillShow={(frames) => this.openedKeyboard(frames)}
        onKeyboardDidShow={(frames) => Platform.OS !== 'ios' && this.openedKeyboard(frames)}
        onKeyboardWillHide={(frames) => this.closedKeyboard(frames)}
        onKeyboardDidHide={(frames) => Platform.OS !== 'ios' && this.closedKeyboard(frames)}
        keyboardShouldPersistTaps="always"
      >
        <SafeAreaView forceInset={{ top: 'never'}}>
        <View style={this.state.viewStyle}>
          <View style={inlineStyles.container}>
            {!this.state.isLoading && (
              <React.Fragment>
                <View>
                  <GiphySelect selectedGiphy={this.state.selectedGiphy} resetGiphy={() => { this.resetGiphy() }} openGiphy={()=> {this.openGiphy() }} />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 20,
                      alignItems: 'center'
                    }}
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
                      returnKeyLabel="Done"
                      serverErrors={this.state.server_errors}
                      placeholderTextColor="#ababab"
                    />
                  )}

                  <Text style={Theme.Errors.errorText}> {this.state.fieldErrorText}</Text>
                </View>
                <View>
                  <View style={{ flexDirection: 'row'}}>
                    <TouchableOpacity
                      disabled={this.state.exceBtnDisabled}
                      style={[
                        Theme.Button.btn,
                        Theme.Button.btnPink,
                        inlineStyles.sendPepoBtn,
                        this.state.exceBtnDisabled ? Theme.Button.disabled : null
                      ]}
                      onPress={() => this.excecuteTransaction()}
                    >
                      <Text style={[Theme.Button.btnPinkText, { fontWeight: '500' }]}>
                        Send{' '}
                        <Image
                          style={{ width: 10, height: 11, tintColor: '#ffffff' }}
                          source={utilities.getTokenSymbolImageConfig()['image1']}
                        ></Image>{' '}
                        {this.state.btAmount}
                      </Text>

                      {/*<Text style={[Theme.Button.btnPinkText]}>{this.state.btAmount}</Text>*/}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[Theme.Button.btn, Theme.Button.btnPink, inlineStyles.dottedBtn]}
                      onPress={() => {
                        this.openEditTx();
                      }}
                    >
                      <Image style={[{ width: 20, height: 20 }, { tintColor: '#ef5566' }]} source={EditIcon}></Image>
                    </TouchableOpacity>
                  </View>
                </View>

              </React.Fragment>
            )}
          </View>
        </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

export default TransactionScreen;
