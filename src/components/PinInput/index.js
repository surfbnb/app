import React, { Component } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

export default class PinInput extends Component {
  constructor() {
    super();
    this.state = {
      code: ''
    };
  }

  render() {
    return (
      <View>
        <Text>Enter Pin</Text>
        <SmoothPinCodeInput
          placeholder="⭑"
          cellStyle={{
            borderWidth: 2,
            borderRadius: 24,
            borderColor: 'orange',
            backgroundColor: 'gold'
          }}
          cellStyleFocused={{
            borderColor: 'darkorange',
            backgroundColor: 'orange'
          }}
          textStyle={{
            fontSize: 24,
            color: 'salmon'
          }}
          textStyleFocused={{
            color: 'crimson'
          }}
          value={code}
          onTextChange={(code) => this.setState({ code })}
        />
      </View>
    );
  }
}
