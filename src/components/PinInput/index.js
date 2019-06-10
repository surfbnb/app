import React, { Component } from 'react';
import { Text, View } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import inlineStyles from './styles';

export default class PinInput extends Component {
  constructor() {
    super();
    this.state = {
      code: ''
    };
  }

  onPinChange = () => {};

  render() {
    return (
      <View style={inlineStyles.container}>
        <Text style={{ marginBottom: 20 }}>
          Add a new 6-digit PIN to secure your Wallet. PIN will also help you recover the wallet if the phone is lost or
          stolen.
        </Text>
        <SmoothPinCodeInput
          codeLength={6}
          cellSize={40}
          cellStyle={{
            borderColor: 'gray',
            borderWidth: 1
          }}
          cellStyleFocused={{}}
          textStyle={{
            fontSize: 14
          }}
          textStyleFocused={{}}
          value={this.state.code}
          onTextChange={(code) => this.setState({ code })}
        />
      </View>
    );
  }
}
