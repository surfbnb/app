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
import CurrentUser from '../../models/CurrentUser';
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
import PixelCall from "../../services/PixelCall";
import pepo_icon from '../../assets/pepo-blue-icon.png';


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
    let exceBtnDisabled = !BigNumber(balance).isGreaterThan(0) || !utilities.isUserActivated( reduxGetter.getUserActivationStatus(this.toUser.id) );
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
    let pixelParams = {
      e_action: 'contribution',
      e_data_json: {
        profile_user_id: this.toUser.id,
        amount: this.state.btAmount
      }
    };
    if(this.videoId){
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
        text: this.state.message,
        giphy: this.state.selectedGiphy,
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
                <View style={{paddingHorizontal: 20}}>
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
                <View style={inlineStyles.txBtnsBg}>
                  <Text style={{marginBottom: 10, color: '#34445b'}}>Balance &#9654;{' '}
                    <Image style={{ width: 10, height: 10}} source={pepo_icon}></Image> {this.state.balance}
                  </Text>
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
                          style={{ width: 10, height: 10, tintColor: '#ffffff' }}
                          source={utilities.getTokenSymbolImageConfig()['image1']}
                        ></Image>{' '}
                        {this.state.btAmount}
                      </Text>

                      {/*<Text style={[Theme.Button.btnPinkText]}>{this.state.btAmount}</Text>*/}
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={this.state.exceBtnDisabled}
                      style={[Theme.Button.btn, Theme.Button.btnPink, inlineStyles.dottedBtn, this.state.exceBtnDisabled ? Theme.Button.disabled : null]}
                      onPress={() => {
                        this.openEditTx();
                      }}
                    >
                      <Image style={[{ width: 20, height: 20 }]} source={EditIcon}></Image>
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
