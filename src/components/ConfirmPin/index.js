import React, { Component } from 'react';
import { View, Alert, Text, Image, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import utilities from '../../services/Utilities';
import PinInput from '../PinInput';
import PinFooter from '../PinInput/PinFooter';
import ActivateUser from '../../services/ActivateUser';
import inlineStyles from './styles';
import BackArrow from '../../assets/back-arrow.png';
import { ostErrors } from '../../services/OstErrors';
import { ostSdkErrors } from '../../services/OstSdkErrors';
import { LoadingModal } from '../../theme/components/LoadingModalCover';
import { navigateTo } from '../../helpers/navigateTo';
import CurrentUser from '../../models/CurrentUser';

export default class ConfirmPin extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Confirm Pin',
      headerBackImage: (
        <View style={{ paddingRight: 30, paddingVertical: 30, paddingLeft: Platform.OS === 'ios' ? 20 : 0 }}>
          <Image source={BackArrow} style={{ width: 10, height: 18, paddingLeft: 8 }} />
        </View>
      ),
      headerRight: <View />
    };
  };
  constructor(props) {
    super(props);
  }

  onPinChange = (pin, resetPinCallback) => {
    if (pin === this.props.navigation.getParam('pin', '')) {
      LoadingModal.show('Activating User...');
      ActivateUser.activateUser(pin, this);
    } else {
      if (resetPinCallback) {
        resetPinCallback();
      }
      Alert.alert('', 'Incorrect Pin');
    }
  };

  onRequestAcknowledge() {
    CurrentUser.updateActivatingStatus()
      .catch(() => {})
      .finally(() => {
        LoadingModal.hide();
        navigateTo.goToNavigationDecision(true);
      });
  }

  onFlowInterrupt(ostWorkflowContext, error) {
    LoadingModal.hide();
    utilities.showAlert(null, ostSdkErrors.getErrorMessage(ostWorkflowContext, error));
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={inlineStyles.container}>
          <Text style={inlineStyles.confirmPinInfoText}>
            If you forget your PIN, you cannot recover your Wallet. So please be sure to remember it.
          </Text>
          <PinInput {...this.props} onPinChange={this.onPinChange} />
        </View>

        <PinFooter />
      </View>
    );
  }
}
