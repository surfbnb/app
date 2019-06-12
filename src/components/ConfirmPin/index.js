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
      <View style={{ marginTop: 25, paddingLeft: 50, paddingRight: 50, fontWeight: '300' }}>
        <Text style={{textAlign: 'center', color: 'rgb(16, 16, 16)', fontSize: 15, lineHeight: 22, fontWeight: '300', marginBottom:20}}>
          If you forget your PIN, you cannot recover your Wallet. So please be sure to remember it.
        </Text>
        <PinInput
          onPinChange={this.onPinChange}
        />
         <LoadingModal />
      </View>
    );
  }
}
