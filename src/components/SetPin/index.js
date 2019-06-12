import React, { Component } from 'react';
import { View , Text, Linking} from 'react-native';
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
    return (
      <View style={inlineStyles.container}>
        <Text style={inlineStyles.confirmPinInfoText}>
          Add a new 6-digit PIN to secure your Wallet. PIN will also help you recover the wallet if the phone is lost or stolen.
        </Text>
        <PinInput
          navigation={this.props.navigation}
          onPinChange={this.onPinChange}/>
          <Text style={inlineStyles.termsPoliciesInfoText}>
           By Creating Your Wallet, you Agree to our
        </Text>
        <Text style={inlineStyles.termsPoliciesLinkText}>
          <Text onPress={() => Linking.openURL('http://google.com')}> Terms of Service </Text>
          <Text style={{fontWeight:'300',}}>and</Text>
          <Text onPress={() => Linking.openURL('http://google.com')}> Privacy Policy </Text>
        </Text>
      </View>
    );
  }
}
