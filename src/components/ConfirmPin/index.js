import React, { Component } from 'react';
import { View, Alert, Text, Image, Linking, KeyboardAvoidingView, Platform } from 'react-native';

import LoadingModal from '../../theme/components/LoadingModal';
import Toast from '../../theme/components/Toast';
import Store from '../../store';
import { showModal, hideModal } from '../../actions';
import utilities from '../../services/Utilities';
import PinInput from '../PinInput';
import PinFooter from '../PinInput/PinFooter';
import ActivateUser from '../../services/ActivateUser';
import inlineStyles from './styles';
import BackArrow from '../../assets/back-arrow.png';
import { ostErrors } from '../../services/OstErrors';

export default class ConfirmPin extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Confirm Pin',
      headerBackImage: <View style={{paddingRight:30,paddingVertical:30}}><Image source={BackArrow} style={{width: 10, height: 18,paddingLeft:8}} /></View>,
      headerRight: <View />
    };
  };
  constructor(props) {
    super(props);
  }

  onPinChange = (pin, resetPinCallback) => {
    if (pin === this.props.navigation.getParam('pin', '')) {
      Store.dispatch(showModal('Activating User...'));
      ActivateUser.activateUser(pin, this);
    } else {
      if (resetPinCallback) {
        resetPinCallback();
      }
      Alert.alert('', 'Incorrect Pin');
    }
  };

  onRequestAcknowledge() {
    Store.dispatch(hideModal());
    this.props.navigation.navigate('HomeScreen');
  }

  onFlowInterrupt(ostWorkflowContext, error) {
    Store.dispatch(hideModal());
    utilities.showAlert(null, ostErrors.getErrorMessage(error));
  }

  render() {
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

        <PinFooter />
      </View>
    );
  }
}
