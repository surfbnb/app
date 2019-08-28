import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, ScrollView, SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import TouchableButton from '../../theme/components/TouchableButton';
import Theme from '../../theme/styles';
import air_drop from '../../assets/airdrop-create-pin.png';
import styles from './Style';

// create a component
export default class UserActivatingScreen extends Component {
  onCreatePin() {
    this.props.navigation.navigate('SetPinScreen');
  }

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView forceInset={{ top: 'never' }}>
          <ScrollView
            contentContainerStyle=
              {{
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 50,
                minHeight: '100%'
              }}
            showsVerticalScrollIndicator={false}>
            <View style={{marginBottom: 20}}>
              <Image source={air_drop} style={{width: 296.5, height: 289.5}} />
              <View style={{position: 'absolute', bottom: 3, left: 0, right: 0}}>
                <Text style={{color: '#fff', textAlign: 'center', fontFamily: 'AvenirNext-DemiBold', fontSize: 12, letterSpacing: 1}}>YOU’VE RECEIVED</Text>
                <Text style={{color: '#fff', textAlign: 'center', fontFamily: 'AvenirNext-Bold', fontSize: 14, letterSpacing: 2}}>200 PEPO COINS</Text>
              </View>
            </View>
            <Text style={[styles.descTxt, {marginBottom: 3}]}>Pepo coins can be used to support your</Text>
            <Text style={[styles.descTxt, {marginBottom: 50}]}>favorite creators!</Text>
            <Text style={styles.descTxt}>Create a PIN to access your wallet and</Text>
            <Text style={[styles.descTxt, {marginTop: 3}]}>claim Pepo Coins</Text>
            <LinearGradient
              colors={['#ff7499', '#ff5566']}
              locations={[0, 1]}
              style={{ marginTop: 30, marginHorizontal: 35, borderRadius: 3}}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableButton
              TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0}]}
              TextStyles={[Theme.Button.btnPinkText]}
              text="Create PIN"
              onPress={() => {
                this.onCreatePin();
              }}
              />
            </LinearGradient>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
