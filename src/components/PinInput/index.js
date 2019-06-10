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
        <Text style={{ marginBottom: 20 }}>{this.props.displayText}</Text>
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
          value={this.state.pin}
          onFulfill={this.props.onPinChange}
          onTextChange={(pin) => this.setState({ pin })}
        />
      </View>
    );
  }
}
