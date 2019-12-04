import React, { Component } from 'react';
import { View, Image, Text, Animated, Easing } from 'react-native';
import ProgressCircle from 'react-native-progress/CircleSnail';

import styles from './styles';
import selfAmountWallet from '../../assets/pepo-amount-wallet.png';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import modalCross from '../../assets/modal-cross-icon.png';
import CurrentUser from '../../models/CurrentUser';
import Pricer from '../../services/Pricer';
import { FlyerEventEmitter } from '../CommonComponents/FlyerHOC';
import EventEmitter from 'eventemitter3';
import { PurchaseLoader } from "../../helpers/PaymentEvents";
import multipleClickHandler from '../../services/MultipleClickHandler';
import { withNavigation } from 'react-navigation';
import PollCurrentUserPendingPayments from "../../helpers/PollCurrentUserPendingPayments";
import Colors from '../../theme/styles/Colors';
import AppConfig from "../../constants/AppConfig";

export const WalletBalanceFlyerEventEmitter = new EventEmitter();

const sendingPepoText = AppConfig.paymentFlowMessages.sendingPepo;
const topupText = 'Topup';

const getBalance = (balance) => {
  return Pricer.getToBT(Pricer.getFromDecimal(balance), 2) || 0;
};

class WalletBalanceFlyer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedWidth: new Animated.Value(0),
      extensionVisible: false,
      isPurchasing : false
    };
  }

  componentDidMount() {
    WalletBalanceFlyerEventEmitter.on('onHideBalanceFlyer', this.handleToggle.bind(this));
    this.purchaseLoaderSubscribtion = new PurchaseLoader( this.updatePurchasingLoader );
    this.purchaseLoaderSubscribtion.subscribeToEvents();
    this.setState({isPurchasing: PollCurrentUserPendingPayments.getPollingStatus()});
  }

  componentWillUnmount() {
    WalletBalanceFlyerEventEmitter.removeListener('onHideBalanceFlyer');
    this.updatePurchasingLoader = () => {};
    this.purchaseLoaderSubscribtion.unSubscribeToEvents();
    this.purchaseLoaderSubscribtion = null;
  }

  updatePurchasingLoader = ( status ,  payload ) => {
    this.state.animatedWidth.setValue(0);
    if( status == this.purchaseLoaderSubscribtion.statusMap.show ){
      this.setState({isPurchasing : true });
    }else if( status == this.purchaseLoaderSubscribtion.statusMap.hide ){
      this.setState({isPurchasing : false });
    }
  }

  handleToggle = () => {
    this.hideFlyer();
  };

  showFlyer = () => {
    FlyerEventEmitter.emit('onToggleProfileFlyer');
    this.state.animatedWidth.setValue(0);
    let widthVal = this.state.isPurchasing ? sendingPepoText.length * 8 : topupText.length * 8 + 30;
    Animated.timing(this.state.animatedWidth, { toValue: ((widthVal) ), duration: 300, easing: Easing.elastic(1) }).start(() => {
      this.setState({
        extensionVisible: true
      });
    });
  };

  hideFlyer = () => {
    Animated.timing(this.state.animatedWidth, { toValue: 0, duration: 300, easing: Easing.linear }).start(() => {
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

    if( getBalance(this.props.balance) < 1 ){
      this.props.navigation.push("StoreProductsScreen");
      return;
    }

    if(!this.isRenderFlyer()){
        this.props.navigation.navigate("ProfileScreen");
    }

  };

  isRenderFlyer(){
    return CurrentUser.isAirDropped() && (  getBalance(this.props.balance) < 1 || this.state.isPurchasing );
  }

  getWalletIcon = () => {
    if( this.state.isPurchasing ){
      return  <View style={styles.shadowLoader}>
                <ProgressCircle size={36} color={Colors.primary} duration={1000} direction="clockwise" useNativeDriver={true} radius={18} />
                <Image style={{ width: 16, height: 16, position: 'absolute', top: '50%', left: '50%', transform: [{translateX: -8}, {translateY: -8}] }}
                       source={selfAmountWallet}></Image>
              </View>;
    }else{
      return <Image style={{ width: 16, height: 16 }} source={selfAmountWallet}></Image>;
    }
  }

  render() {
    const contentOpacity = this.state.animatedWidth.interpolate({
      inputRange: [0, 50, 75],
      outputRange: [0, 0.1, 1]
    });
    if(this.props.balance == null) return null;
    return (
      <View style={[styles.topBg]}>
        {this.isRenderFlyer() && (
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: this.state.animatedWidth,
              opacity: contentOpacity
            }}
          >
            <TouchableWithoutFeedback onPress={this.hideFlyer} style={styles.crossIconClickSpace}>
              <Image style={[styles.crossIconSkipFont]} source={modalCross} />
            </TouchableWithoutFeedback>
            <Text style={[styles.topUp , {color: this.state.isPurchasing ? Colors.black : Colors.wildWatermelon2 } ]}>
               {this.state.isPurchasing ? sendingPepoText : topupText}
            </Text>
          </Animated.View>
        )}
        <TouchableWithoutFeedback onPress={multipleClickHandler(() => this.handlePress())}>
          <View style={[styles.innerTopBg, { minWidth: getBalance(this.props.balance) <= 0 ? 50 : 'auto' }]}>
            {this.getWalletIcon()}
            <Text style={styles.topBgTxt}>{Pricer.displayAmountWithKFomatter(getBalance(this.props.balance))}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default withNavigation( WalletBalanceFlyer );
