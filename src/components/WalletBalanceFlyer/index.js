import React, { Component } from 'react';
import { View, Image, Text, Animated, Easing } from 'react-native';

import styles from './styles';
import selfAmountWallet from '../../assets/self-amount-wallet.png';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import modalCross from "../../assets/modal-cross-icon.png";

class WalletBalanceFlyer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedWidth: new Animated.Value(0),
      extensionVisible: false
    };
  }

  showFlyer = () => {
    this.state.animatedWidth.setValue(0);
    Animated.timing(this.state.animatedWidth, { toValue: 210, duration: 300, easing: Easing.linear }).start(() => {
      this.setState({
        extensionVisible: true
      });
    });
  };

  hideFlyer = () => {
    Animated.timing(this.state.animatedWidth, { toValue: 0, duration: 300,  easing: Easing.linear }).start(() => {
      this.setState({
        extensionVisible: false
      });
    });
  };

  handlePress = () => {
    if (this.state.extensionVisible) {
      this.hideFlyer();
    } else {
      this.showFlyer();
    }
  };

  render() {
    const contentOpacity = this.state.animatedWidth.interpolate({
      inputRange: [0, 190, 210],
      outputRange: [0, 0.1, 1]
    });
    return (
        <View style={[ styles.topBg ]}>
          {!!this.props.balance <= 0 &&
            <Animated.View style={{flexDirection: 'row', alignItems: 'center', width: this.state.animatedWidth, opacity: contentOpacity}}>
              <TouchableWithoutFeedback onPress={this.hideFlyer} style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
                <Image style={[styles.crossIcon]} source={modalCross}/>
              </TouchableWithoutFeedback>
              <Text>{' '}Low Balance please{' '}</Text>
              <Text style={{color: '#ff5566', fontFamily: 'AvenirNext-DemiBold', fontSize: 14}}>Topup</Text>
            </Animated.View>
          }
          <TouchableWithoutFeedback onPress={this.handlePress}>
            <View
              style={{ height: 46, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', minWidth: this.props.balance <= 0 ? 60 : ''  }}
            >
              <Image style={{ height: 11.55, width: 11.55 }} source={selfAmountWallet} />
              <Text style={styles.topBgTxt}>
                {this.props.balance}
                {/*99999.99*/}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
    ) ;
  }
}

export default WalletBalanceFlyer;
