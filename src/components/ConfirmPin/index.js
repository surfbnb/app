import React, { Component } from 'react';
import { View, Alert, Text, Image, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import LoadingModal from '../../theme/components/LoadingModal';
import Toast from '../../theme/components/Toast';
import Store from '../../store';
import { showModal, hideModal } from '../../actions';
import utilities from '../../services/Utilities';

import PinInput from '../PinInput';
import ActivateUser from '../../services/ActivateUser';
import inlineStyles from './styles';
import BackArrow from '../../assets/back-arrow.png';

export default class ConfirmPin extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Confirm Pin',
      headerBackImage: <Image source={BackArrow} style={{ width: 10, height: 18, marginLeft: 8 }} />,
      headerRight: <View />
    };
  };
  constructor(props) {
    super(props);
  }

  onPinChange = (pin) => {
    if (pin === this.props.navigation.getParam('pin', '')) {
      Store.dispatch(showModal('Activating User...'));
      ActivateUser.activateUser(pin, this);
    } else {
      Alert.alert('', 'Incorrect Pin');
    }
  };

  onRequestAcknowledge() {
    Store.dispatch(hideModal());
    this.props.navigation.navigate('HomeScreen');
  }

  onFlowInterrupt(ostWorkflowContext, ostError) {
    Store.dispatch(hideModal());
    let errMsg = utilities.getErrorMessage(ostError);
    utilities.showAlert(null, errMsg);
  }

  render() {
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : -500;
    return (
      <View style={{ flex: 1 }}>
        <View style={inlineStyles.container}>
          <Text style={inlineStyles.confirmPinInfoText}>
            If you forget your PIN, you cannot recover your Wallet. So please be sure to remember it.
          </Text>
          <PinInput {...this.props} onPinChange={this.onPinChange} />
          <LoadingModal />
          <Toast timeout={3000} />
        </View>

        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
          <View>
            <Text style={inlineStyles.termsPoliciesInfoText}>By Creating Your Wallet, you Agree to our</Text>
            <Text style={inlineStyles.termsPoliciesLinkText}>
              <Text onPress={() => Linking.openURL('http://google.com')}> Terms of Service </Text>
              <Text style={{ fontWeight: '300', color: '#484848' }}>and</Text>
              <Text onPress={() => Linking.openURL('http://google.com')}> Privacy Policy </Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
