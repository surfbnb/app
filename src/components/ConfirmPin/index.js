import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import PinInput from '../PinInput';

export default class ConfirmPin extends Component {
  constructor(props) {
    super(props);
  }

  onPinChange = (pin) => {
    if (pin === this.props.navigation.getParam('pin', '')) {
      this.props.navigation.navigate('HomeScreen');
    } else {
      Alert.alert('', 'Incorrect Pin');
    }
  };

  render() {
    return (
      <View>
        <PinInput
          onPinChange={this.onPinChange}
          displayText="If you forget your PIN, you cannot recover your Wallet. So please be sure to remember it."
        />
      </View>
    );
  }
}
