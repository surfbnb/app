import React, { Component } from 'react';
import { View , Text} from 'react-native';
import PinInput from '../PinInput';

export default class SetPin extends Component {
  constructor(props) {
    super(props);
  }

  onPinChange = (pin) => {
    this.props.navigation.navigate('ConfirmPinScreen', { pin });
  };

  render() {
    return (
      <View style={{ marginTop: 25,flex:1, paddingLeft: 50, paddingRight: 50 }}>
        <Text style={{textAlign: 'center', color: 'rgb(16, 16, 16)', fontSize: 15, lineHeight: 22, fontWeight: '300', marginBottom:20}}>
          Add a new 6-digit PIN to secure your Wallet. PIN will also help you recover the wallet if the phone is lost or stolen.
        </Text>
        <PinInput
          navigation={this.props.navigation}
          onPinChange={this.onPinChange}/>
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
