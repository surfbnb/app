import React, { Component } from 'react';
import { View, Alert, Text } from 'react-native';

import PinInput from '../PinInput';
import ActivateUser from '../../services/ActivateUser';

export default class ConfirmPin extends Component {
  constructor(props) {
    super(props);
  }

  onPinChange = (pin) => {
    if (pin === this.props.navigation.getParam('pin', '')) {
      this.props.navigation.navigate('HomeScreen');
      ActivateUser.activateUser(pin);
    } else {
      Alert.alert('', 'Incorrect Pin');
    }
  };

  render() {
    return (
      <View>
        <Text> If you forget your PIN, you cannot recover your Wallet. So please be sure to remember it. </Text>
        <PinInput
          onPinChange={this.onPinChange}
        />
      </View>
    );
  }
}
