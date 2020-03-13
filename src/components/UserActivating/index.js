import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import LinearGradient from 'react-native-linear-gradient';

import TouchableButton from '../../theme/components/TouchableButton';
import Theme from '../../theme/styles';
import air_drop from '../../assets/airdrop-create-pin.png';
import styles from './Style';
import Pricer from '../../services/Pricer';
import ReduxGetters from '../../services/ReduxGetters';

// create a component
export default class UserActivatingScreen extends Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null,
      headerBackTitle: null
    };
  };

  onCreatePin() {
    this.props.navigation.navigate('SetPinScreen');
  }

  getAirDropPepoAmount(){
    const pepoAmountInWei = ReduxGetters.getPepoAmtInWei();
    return Pricer.getFromDecimal(pepoAmountInWei);
  }

  getAirDropUSDAmount(){
    const pepoAmtInUSD = ReduxGetters.getPepoAmtInUSD();
    return pepoAmtInUSD ;
  }


  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView forceInset={{ top: 'never' }}>
          <ScrollView
            contentContainerStyle=
              {{
                flexGrow: 1,
                justifyContent: 'center'
              }}
            showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              <Image source={air_drop} style={{width: 137.5, height: 192}} />
              <Text style={styles.heading}>Welcome Gift!</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.desc}>You’ve received <Text style={[styles.desc, {color: '#ff5566', fontWeight: '700'}]}> {this.getAirDropPepoAmount()} </Text>Pepo!</Text>
                <Text style={styles.desc}>${this.getAirDropUSDAmount()} Value!</Text>
              </View>
            </View>
            <View style={{paddingBottom: 30}}>
              <LinearGradient
                colors={['#ff7499', '#ff5566']}
                locations={[0, 1]}
                style={{ marginHorizontal: 30, borderRadius: 3}}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <TouchableButton
                  TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0}]}
                  TextStyles={[Theme.Button.btnPinkText]}
                  text="Add to Wallet"
                  onPress={() => {
                    this.onCreatePin();
                  }}
                />
              </LinearGradient>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
