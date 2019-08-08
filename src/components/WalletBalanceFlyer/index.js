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
      inputRange: [0, 210, 230],
      outputRange: [0, 0.1, 1],
      extrapolate: 'clamp'
    });
  }

  showFlyer = () => {
    Animated.timing(this.state.animatedWidth, { toValue: 230, duration: 300 }).start(() => {
      this.setState({
        extensionVisible: true
      });
    });
  };

  hideFlyer = () => {
    Animated.timing(this.state.animatedWidth, { toValue: 0, duration: 300 }).start(() => {
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
    return (
        <View style={[ styles.topBg ]}>
          {!!this.props.balance <= 0 &&
            <Animated.View style={{flexDirection: 'row', width: this.state.animatedWidth, opacity: this.contentOpacity}}>
              <TouchableWithoutFeedback onPress={this.hideFlyer} style={{alignItems: 'center', width: 19.5, height: 19}}>
                <React.Fragment>
                  <Image style={styles.crossIcon} source={modalCross}/>
                </React.Fragment>
              </TouchableWithoutFeedback>
              <Text style={{marginLeft: 10}}>Low Balance please</Text>
              <Text style={{marginLeft: 5}}>Topup</Text>
            </Animated.View>
          }
          <TouchableWithoutFeedback onPress={this.handlePress}>
            <View
              style={{ height: 46, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
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
