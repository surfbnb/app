import React, { Component } from 'react';
import { View , Text, KeyboardAvoidingView, Linking} from 'react-native';
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

        <KeyboardAvoidingView   behavior="padding" style={{flex: 1}} >
            <View style={{
            marginTop: 25,
            paddingLeft: 50,
            paddingRight: 50,
            fontWeight: '300',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-between'}}>
              <Text style={{textAlign: 'center', color: '#848484', fontSize: 15, lineHeight: 22, fontWeight: '300', marginBottom:20}}>
              Add a new 6-digit PIN to secure your Wallet. PIN will also help you recover the wallet if the phone is lost or stolen.
              </Text>
              <PinInput
               navigation={this.props.navigation}
                onPinChange={this.onPinChange}
              />
            </View>

            <View style={{flex: 1, justifyContent: "space-evenly"}}>
              <View>
                <View>
                  <Text style={{alignSelf:'center', marginBottom:5, fontSize:12, fontWeight:'300', color: 'rgb(136, 136, 136)' }}>
                  By Creating Your Wallet, you Agree to our</Text>
                </View>
                <Text style={{ alignSelf:'center', marginBottom:15, fontSize:12, color: '#3296d0' }}>
                  <Text onPress={() => Linking.openURL('http://google.com')}> Terms of Service </Text>
                  <Text style={{fontWeight:'300', color: '#484848'}}>and</Text>
                  <Text onPress={() => Linking.openURL('http://google.com')}> Privacy Policy </Text>
                </Text>
              </View>
            </View>
        </KeyboardAvoidingView>



    );
  }
}
