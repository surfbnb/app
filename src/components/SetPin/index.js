import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import PinInput from '../PinInput';
import styles from '../../theme/styles';
import PinFooter from '../PinInput/PinFooter';

import inlineStyles from './styles';

export default class SetPin extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      headerTitle: 'Set PIN',
      headerBackTitle: null
    };
  };

  constructor(props) {
    super(props);
  }

  onPinChange = (pin) => {
    this.props.navigation.navigate('ConfirmPinScreen', { pin });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={inlineStyles.container}>
          <Text style={inlineStyles.setPinInfoText}>
            Set a 6-digit PIN for your Wallet. Your PIN is required to recover your wallet if your phone is lost or stolen.
          </Text>
          <PinInput {...this.props} onPinChange={this.onPinChange} />
        </View>

        <PinFooter />
      </View>
    );
  }
}
