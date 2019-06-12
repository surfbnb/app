import React, { Component } from 'react';
import { View, Alert, Text, Linking, KeyboardAvoidingView } from 'react-native';
import LoadingModal from '../LoadingModal';
import Store from '../../store';
import { showModal, hideModal } from '../../actions';

import PinInput from '../PinInput';
import ActivateUser from '../../services/ActivateUser';
import inlineStyles from './styles'
export default class ConfirmPin extends Component {
  constructor(props) {
    super(props);
  }

  onPinChange = (pin) => {
    if (pin === this.props.navigation.getParam('pin', '')) {
      Store.dispatch(showModal('Activatig User...'));
      ActivateUser.activateUser(pin, this);
    } else {
      Alert.alert('', 'Incorrect Pin');
    }
  };

  onRequestAcknowledge(ostWorkflowContext, ostContextEntity) {
    Store.dispatch(hideModal());
    this.props.navigation.navigate('HomeScreen');
  }

  onFlowInterrupt(ostWorkflowContext, ostError) {
    Store.dispatch(hideModal());
    let errMsg = (ostError && ostError.getErrorMessage()) || ErrorMessages.general_error;
    Alert.alert('', errMsg);
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View
          style={{
            marginTop: 25,
            paddingLeft: 50,
            paddingRight: 50,
            fontWeight: '300',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-between'
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: '#848484',
              fontSize: 15,
              lineHeight: 22,
              fontWeight: '300',
              marginBottom: 20
            }}
          >
            If you forget your PIN, you cannot recover your Wallet. So please be sure to remember it.
          </Text>
          <PinInput {...this.props} onPinChange={this.onPinChange} />
          <LoadingModal />
        </View>

        <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
          <View>
            <View>
              <Text
                style={{
                  alignSelf: 'center',
                  marginBottom: 5,
                  fontSize: 12,
                  fontWeight: '300',
                  color: 'rgb(136, 136, 136)'
                }}
              >
                By Creating Your Wallet, you Agree to our
              </Text>
            </View>
            <Text style={{ alignSelf: 'center', marginBottom: 15, fontSize: 12, color: '#3296d0' }}>
              <Text onPress={() => Linking.openURL('http://google.com')}> Terms of Service </Text>
              <Text style={{ fontWeight: '300', color: '#484848' }}>and</Text>
              <Text onPress={() => Linking.openURL('http://google.com')}> Privacy Policy </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
