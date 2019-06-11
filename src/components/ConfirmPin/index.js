import React, { Component } from 'react';
import { View, Alert, Text } from 'react-native';
import LoadingModal from '../LoadingModal';
import Store from "../../store"; 
import { showModal, hideModal } from '../../actions';

import PinInput from '../PinInput';
import ActivateUser from '../../services/ActivateUser';

export default class ConfirmPin extends Component {
  constructor(props) {
    super(props);
  }

  onPinChange = (pin) => {
    if (pin === this.props.navigation.getParam('pin', '')) {
      Store.dispatch( showModal( "Activatig User...") ); 
      ActivateUser.activateUser(pin , this);
    } else {
      Alert.alert('', 'Incorrect Pin');
    }
  };

  onRequestAcknowledge( ostWorkflowContext , ostContextEntity  ){
    Store.dispatch( hideModal( ) ); 
    this.props.navigation.navigate('HomeScreen');
  }

  onFlowInterrupt( ostWorkflowContext , ostError  ){
    Store.dispatch( hideModal( ) ); 
    let errMsg = ostError && ostError.getErrorMessage() || ErrorMessages.general_error; 
    Alert.alert('', errMsg );
  }

  render() {
    return (
      <View>
        <Text> If you forget your PIN, you cannot recover your Wallet. So please be sure to remember it. </Text>
        <PinInput
          onPinChange={this.onPinChange}
        />
         <LoadingModal />
      </View>
    );
  }
}
