import React, { Component } from 'react';
import { Text, View } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import inlineStyles from './styles';

export default class PinInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: ''
    };
  }

  render() {
    return (
      <View style={inlineStyles.container}>
        <Text style={inlineStyles.displayText}>{this.props.displayText}</Text>
        <SmoothPinCodeInput
          codeLength={6}
          autoFocus={true}
          cellSize={12}
          cellStyle={{
            borderColor: '#A9A9A9',
            backgroundColor: '#A9A9A9',
            borderRadius: 24,
            borderWidth: 1
          }}
          cellSpacing={30}
          cellStyleFocused={{
            borderColor: '#61b2d6',
            backgroundColor: '#61b2d6'
          }}
          textStyleFocused={{}}
          value={this.state.pin}
          password
          mask=" "
          onFulfill={this.props.onPinChange}
        />
      </View>
    );
  }
}
