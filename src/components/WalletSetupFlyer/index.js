import React, { Component } from 'react';
import { View, Image } from 'react-native';
import ProgressCircle from 'react-native-progress/CircleSnail';

import styles from './styles';
import WalletIcon from '../../assets/profile-flyer-wallet.png';
import flyerHOC from '../CommonComponents/FlyerHOC';
import Colors from '../../theme/styles/Colors';

class WalletSetupFlyer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: 46,
            height: 46,
            backgroundColor: Colors.white,
            opacity: 0.9,
            borderRadius: 23,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ProgressCircle size={53} color={Colors.primary} duration={1000} direction="clockwise" useNativeDriver={true}/>
        </View>
        <Image source={WalletIcon} style={{ width: 15, height: 15, position: 'absolute' }} />
      </View>
    );
  }
}

export default flyerHOC(WalletSetupFlyer);
