import React, { Component } from 'react';
import { View, Alert, Text, Linking } from 'react-native';
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
      <View style={{ marginTop: 25,flex:1, paddingLeft: 50, paddingRight: 50, fontWeight: '300' }}>
        <Text style={{textAlign: 'center', color: 'rgb(16, 16, 16)', fontSize: 15, lineHeight: 22, fontWeight: '300', marginBottom:20}}>
          If you forget your PIN, you cannot recover your Wallet. So please be sure to remember it.
        </Text>
        <PinInput
          onPinChange={this.onPinChange}
        />
         <LoadingModal />
        <Text style={{flexDirection:'row', alignSelf:'center', marginBottom:5, fontSize:12, fontWeight:'300', color: 'rgb(136, 136, 136)' }}>
           By Creating Your Wallet, you Agree to our
        </Text>
        <Text style={{flexDirection:'row', alignSelf:'center', marginBottom:15, fontSize:12, fontWeight:'500', color: 'rgb(136, 136, 136)' }}>
          <Text onPress={() => Linking.openURL('http://google.com')}> Terms of Service </Text>
          <Text style={{fontWeight:'300',}}>and</Text>
          <Text onPress={() => Linking.openURL('http://google.com')}> Privacy Policy </Text>
        </Text>
      </View>
    );
  }
}
