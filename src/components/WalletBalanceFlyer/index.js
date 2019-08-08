import React, { Component } from 'react';
import { View, Image, Text, Animated } from 'react-native';

import styles from './styles';
import selfAmountWallet from '../../assets/self-amount-wallet.png';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import modalCross from "../../assets/modal-cross-icon.png";

class WalletBalanceFlyer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedWidth: new Animated.Value(60),
      extensionVisible: false
    };
    this.contentOpacity = this.state.animatedWidth.interpolate({
      inputRange: [0, 230, 250],
      outputRange: [0, 0.1, 1],
      extrapolate: 'clamp'
    });
    this.highlightedContentOpacity = this.state.animatedWidth.interpolate({
      inputRange: [0, 230, 250],
      outputRange: ['rgba(255,85,102,0)', 'rgba(255,85,102,0.1)', 'rgba(255,85,102,1)'],
      extrapolate: 'clamp'
    });
  }

  showFlyer = () => {
    Animated.timing(this.state.animatedWidth, { toValue: 270, duration: 300 }).start(() => {
      this.setState({
        extensionVisible: true
      });
    });
  };

  hideFlyer = () => {
    Animated.timing(this.state.animatedWidth, { toValue: 60, duration: 300 }).start(() => {
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
    return this.props.balance <= 0 ? (
      <Animated.View style={[styles.topBg, { width: this.state.animatedWidth }]}>
        <View style={{ flexDirection: 'row', width: 100 }}>
          <TouchableWithoutFeedback onPress={this.hideFlyer} style={{alignItems: 'center', width: 19.5, height: 19}}>
            <Animated.View style={[styles.crossIcon, { color: this.contentOpacity, alignSelf: 'center' }]}>
              <Image style={{ width: 12.6, height: 12.6 }} source={modalCross}/>
            </Animated.View>
          </TouchableWithoutFeedback>
          <Animated.Text style={{ marginLeft: 10 }}>Low Balance please</Animated.Text>
          <Animated.Text style={{ marginLeft: 5 }}>Topup</Animated.Text>
        </View>
        <TouchableWithoutFeedback onPress={this.handlePress}>
          <View
            style={{ minWidth: 50, height: 46, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          >
            <Animated.Image style={{ height: 11.55, width: 11.55 }} source={selfAmountWallet} />
            <Animated.Text style={styles.topBgTxt}>{this.props.balance}</Animated.Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    ) : (
      <View style={styles.topBg}>
        <Image style={{ height: 11.55, width: 11.55 }} source={selfAmountWallet} />
        <Text style={styles.topBgTxt}>{this.props.balance}</Text>
      </View>
    );
  }
}

export default WalletBalanceFlyer;
