import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import PinInput from '../PinInput';
import styles from '../../theme/styles';

import inlineStyles from './styles'

export default class SetPin extends Component {
  constructor(props) {
    super(props);
  }

  onPinChange = (pin) => {
    this.props.navigation.navigate('ConfirmPinScreen', { pin });
  };

  render() {
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : -500;
    return (
      <View style={{ flex: 1 }}>
        <View
          style={inlineStyles.container}
        >
          <Text
            style={inlineStyles.setPinInfoText}
          >
            Add a new 6-digit PIN to secure your Wallet. PIN will also help you recover the wallet if the phone is lost
            or stolen.
          </Text>
          <PinInput {...this.props} onPinChange={this.onPinChange} />
        </View>

        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
          <View>
            <Text
              style={inlineStyles.termsPoliciesInfoText}
            >
              By Creating Your Wallet, you Agree to our
            </Text>
          </View>
          <Text style={inlineStyles.termsPoliciesLinkText}>
            <Text onPress={() => Linking.openURL('http://google.com')}> Terms of Service </Text>
            <Text style={{ fontWeight: '300', color: '#484848' }}>and</Text>
            <Text onPress={() => Linking.openURL('http://google.com')}> Privacy Policy </Text>
          </Text>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
