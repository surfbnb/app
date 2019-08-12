import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Keyboard, BackHandler } from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import tx_success from '../../assets/transaction_success.png';
import pepo_icon from '../../assets/pepo-tx-icon.png';
import deepGet from 'lodash/get';
import inlineStyles from './Style';
import modalCross from '../../assets/modal-cross-icon.png';


const bottomSpace = getBottomSpace([true]),
  extraPadding = 10,
  safeAreaBottomSpace = isIphoneX() ? bottomSpace : extraPadding;

class SayThanks extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      closeDisabled: false      
    };
  }

  componentWillMount() {
    this.defaultVals();
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShown.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardHidden.bind(this));

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShown.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHidden.bind(this));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  defaultVals(){

  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
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

  closeModal() {
    this.setState({ btFocus: false, usdFocus: false }, () => {
      this.props.navigation.goBack();
    });
  }

  handleBackButtonClick = () => {
    if (this.state.closeDisabled) {
      return true;
    }
  };

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
              right: 10,
              width: 38,
              height: 38,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            disabled={this.state.closeDisabled}
          >
            <Image source={modalCross} style={{ width: 13, height: 12.6 }} />
          </TouchableOpacity>
          <Text style={inlineStyles.modalHeader}>headerText</Text>
        </View>
      </View>
    );
  }
}

export default SayThanks;
