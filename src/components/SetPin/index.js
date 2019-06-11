import React, { Component } from 'react';
import { View } from 'react-native';
import PinInput from '../PinInput';

export default class SetPin extends Component {
  constructor(props) {
    super(props);
  }

  onPinChange = (pin) => {
    this.props.navigation.navigate('ConfirmPinScreen', { pin });
  };

  render() {
    return (
      <View>
        <PinInput
          navigation={this.props.navigation}
          onPinChange={this.onPinChange}
          displayText="Add a new 6-digit PIN to secure your Wallet. PIN will also help you recover the wallet if the phone is lost or
          stolen."
        />
      </View>
    );
  }
}
