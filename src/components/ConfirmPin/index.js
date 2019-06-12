import React, { Component } from 'react';
import {View, Alert, Text, Linking, KeyboardAvoidingView, Platform} from 'react-native';
import LoadingModal from '../LoadingModal';
import Store from '../../store';
import { showModal, hideModal } from '../../actions';

import PinInput from '../PinInput';
import ActivateUser from '../../services/ActivateUser';
import inlineStyles from './styles'
export default class ConfirmPin extends Component {
  constructor(props) {
    super(props);
  }

  onPinChange = (pin) => {
    if (pin === this.props.navigation.getParam('pin', '')) {
      Store.dispatch(showModal('Activating User...'));
      ActivateUser.activateUser(pin, this);
    } else {
      Alert.alert('', 'Incorrect Pin');
    }
  };

  onRequestAcknowledge(ostWorkflowContext, ostContextEntity) {
    Store.dispatch(hideModal());
    this.props.navigation.navigate('HomeScreen');
  }

  onFlowInterrupt(ostWorkflowContext, ostError) {
    Store.dispatch(hideModal());
    let errMsg = (ostError && ostError.getErrorMessage()) || ErrorMessages.general_error;
    Alert.alert('', errMsg);
  }

  render() {
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : -500;
    return (
      <View style={{ flex: 1 }}>
        <View
          style={inlineStyles.container}
        >
          <Text
            style={inlineStyles.confirmPinInfoText}
          >
            If you forget your PIN, you cannot recover your Wallet. So please be sure to remember it.
          </Text>
          <PinInput {...this.props} onPinChange={this.onPinChange} />
          <LoadingModal />
        </View>

        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
          <View>
            <Text
              style={inlineStyles.termsPoliciesInfoText}
            >
              By Creating Your Wallet, you Agree to our
            </Text>
            <Text style={inlineStyles.termsPoliciesLinkText}>
              <Text onPress={() => Linking.openURL('http://google.com')}> Terms of Service </Text>
              <Text style={{ fontWeight: '300', color: '#484848' }}>and</Text>
              <Text onPress={() => Linking.openURL('http://google.com')}> Privacy Policy </Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
