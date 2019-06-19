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
      headerTitle: 'Set Pin',
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
            Add a new 6-digit PIN to secure your Wallet. PIN will also help you recover the wallet if the phone is lost
            or stolen.
          </Text>
          <PinInput {...this.props} onPinChange={this.onPinChange} />
        </View>

        <PinFooter />
      </View>
    );
  }
}
