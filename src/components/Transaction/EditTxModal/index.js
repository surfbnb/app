import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard, Platform
} from 'react-native';

import FormInput from '../../../theme/components/FormInput';
import TouchableButton from '../../../theme/components/TouchableButton';
import { ostErrors } from '../../../services/OstErrors';
import CircleCloseIcon from '../../../assets/circle_close_icon.png';
import Theme from '../../../theme/styles';
import inlineStyles from '../Style';
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";
import deepGet from "lodash/get";


const bottomSpace = getBottomSpace([true])
  , extraPadding = 10
  , safeAreaBottomSpace = isIphoneX() ? bottomSpace : extraPadding
;

export default class EditTxModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.getState();
    this.getPriceOracle = props.navigation.getParam('getPriceOracle');
    this.onAmountModalConfirm = props.navigation.getParam('onAmountModalConfirm');
    this.balance = props.navigation.getParam('balance');
  }

  getState() {
    return {
      btAmount: this.props.navigation.getParam('btAmount'),
      btUSDAmount: this.props.navigation.getParam('btUSDAmount'),
      btAmountErrorMsg: null,
      bottomPadding: safeAreaBottomSpace,
      btFocus: false
    };
  }

  componentWillMount() {

    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this._keyboardShown.bind(this),
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this._keyboardHidden.bind(this),
    );

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardShown.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardHidden.bind(this),
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentDidMount(){
    this.setState({btFocus: true});
  }

  _keyboardShown(e) {
    let bottomPaddingValue = deepGet(e, "endCoordinates.height") || 350;
    bottomPaddingValue +=  extraPadding;

    if (this.state.bottomPadding == bottomPaddingValue) {return}

    this.setState({
      bottomPadding: bottomPaddingValue
    })
  }

  _keyboardHidden(e) {

    if (this.state.bottomPadding == safeAreaBottomSpace) {return}
    this.setState({
      bottomPadding: safeAreaBottomSpace,
    })
  }

  onBtChange(bt) {
    const priceOracle = this.getPriceOracle();
    if(!priceOracle) return ; 
    this.setState({ btAmount: bt, btUSDAmount: priceOracle.btToFiat(bt) });
    if (bt > 0) {
      this.setState({ btAmountErrorMsg: null });
    }
  }

  onUSDChange(usd) {
    const priceOracle = this.getPriceOracle() ;
    if(!priceOracle) return ; 
    this.setState({ btAmount: priceOracle.fiatToBt(usd), btUSDAmount: usd });
  }

  onConfirm = () => {
    let btAmount = this.state.btAmount;
    btAmount = btAmount && Number(btAmount);
    if (btAmount <= 0 || btAmount > this.balance) {
      this.setState({ btAmountErrorMsg: ostErrors.getUIErrorMessage('bt_amount_error') });
      return;
    }
    this.onAmountModalConfirm(this.state.btAmount, this.state.btUSDAmount);
    this.closeModal();
  };

  closeModal(){
    this.setState({btFocus: false} , () =>{
      this.props.navigation.goBack();
    });
  }

  render(){
    return(
      <TouchableWithoutFeedback onPressOut={() => {this.props.navigation.goBack(); }} >
      <View animationType="slide"
            transparent={true}
            style={inlineStyles.modalBackDrop}
      >

        <View style={[inlineStyles.modelWrapper, {paddingBottom: this.state.bottomPadding}]}>
          <TouchableOpacity
            style={inlineStyles.modalCloseBtnWrapper}
            onPress={() => { this.closeModal() }}
          >
            <Image source={CircleCloseIcon} style={inlineStyles.crossIconSkipFont} />
          </TouchableOpacity>
          <TouchableWithoutFeedback>
          <View style={inlineStyles.modalContentWrapper}>
            <Text style={inlineStyles.modalHeader}>Enter The Amount you want to send</Text>
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
                <TextInput  editable={false} style={[Theme.TextInput.textInputStyle, inlineStyles.nonEditableTextInput]}  >
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
                this.onConfirm();
              }}
            />
            <Text style={{ textAlign: 'center', paddingTop: 10, fontSize: 13 }}>
              Your Current Balance: P{this.balance}
            </Text>
          </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      </TouchableWithoutFeedback>
    )
  }
}
