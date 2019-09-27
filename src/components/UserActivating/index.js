import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, ScrollView, SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import TouchableButton from '../../theme/components/TouchableButton';
import Theme from '../../theme/styles';
import air_drop from '../../assets/airdrop-create-pin.png';
import styles from './Style';

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

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView forceInset={{ top: 'never' }}>
          <ScrollView
            contentContainerStyle=
              {{
                paddingVertical: 50,
                flexGrow: 1,
                justifyContent: 'center'
              }}
            showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              <Image source={air_drop} style={{width: 137.5, height: 192}} />
              <Text style={styles.heading}>Welcome Gift!</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.desc}>You’ve received <Text style={[styles.desc, {color: '#ff5566', fontWeight: '700'}]}>500 </Text>Pepo!</Text>
                <Text style={styles.desc}>$5 Value!</Text>
              </View>
            </View>
            <LinearGradient
              colors={['#ff7499', '#ff5566']}
              locations={[0, 1]}
              style={{ marginHorizontal: 30, borderRadius: 3, marginTop: 100}}
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
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
