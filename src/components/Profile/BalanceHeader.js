import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import { View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Text, Image } from 'react-native';
import pricer from '../../services/Pricer';
import inlineProfileStyles from './styles';
import selfAmountWallet from '../../assets/pepo-amount-wallet.png';
import topUpIcon from '../../assets/top-up-icon.png';
import storeIcon from '../../assets/balanace-header-store.png'
import inlineUserStyles from "../CommonComponents/UserInfo/styles";
import LinearGradient from "react-native-linear-gradient";
import { withNavigation } from 'react-navigation';
import CurrentUser from '../../models/CurrentUser';
import ProgressCircle from 'react-native-progress/CircleSnail';

import Colors from '../../theme/styles/Colors';

import { PurchaseLoader } from "../../helpers/PaymentEvents";
import PollCurrentUserPendingPayments from "../../helpers/PollCurrentUserPendingPayments";
import Toast from '../../theme/components/NotificationToast';
import appConfig from "../../constants/AppConfig";
import { ostErrors } from '../../services/OstErrors';
import AppConfig from '../../constants/AppConfig';
import MultipleClickHandler from '../../services/MultipleClickHandler';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import pepoCornsImg from '../../assets/UnicornSmall.png';
import {testProps} from "../../constants/AppiumAutomation";
import Utilities from "../../services/Utilities";

import multipleClickHandler from '../../services/MultipleClickHandler';

const mapStateToProps = (state) => ({ balance: state.balance });

class BalanceHeader extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isPurchasing : false
    }
    this.purchaseLoaderSubscribtion  = null ;
  }

  componentDidMount(){
    this.purchaseLoaderSubscribtion = new PurchaseLoader( this.updatePurchasingLoader );
    this.purchaseLoaderSubscribtion.subscribeToEvents();
    this.setState({isPurchasing: PollCurrentUserPendingPayments.getPollingStatus()});
  }

  componentWillUnmount(){
    this.updatePurchasingLoader = () => {};
    this.purchaseLoaderSubscribtion.unSubscribeToEvents();
    this.purchaseLoaderSubscribtion = null;
  }

  updatePurchasingLoader = ( status ,  payload ) => {
    if( status == this.purchaseLoaderSubscribtion.statusMap.show ){
      this.setState({isPurchasing : true });
    }else if( status == this.purchaseLoaderSubscribtion.statusMap.hide ){
      this.setState({isPurchasing : false });
    }
  }

  onPurchaseInProgress = () => {
    Toast.show({
      text:  appConfig.paymentFlowMessages.sendingPepo,
      icon: 'pepo'
    });
  }

  __toBt( val ){
    const priceOracle =  pricer.getPriceOracle() ;
    return priceOracle.fromDecimal( val ) || 0 ;
  }

  toBt( val ){
    return pricer.toDisplayAmount( this.__toBt(val) );
  }

  toFiat( val ){
    const priceOracle =  pricer.getPriceOracle() ;
    val = priceOracle.fromDecimal( val );
    return pricer.toDisplayAmount( priceOracle.btToFiat( val ));
  }


  isDevicesAuthorized( device ) {
    return device && device.status && device.status.toLowerCase() == AppConfig.deviceStatusMap.authorized;
  }

  onTopUp = () => {
    if(CurrentUser.isUserActivated()){
      this.props.navigation.push("StoreProductsScreen");
    }else{
      Toast.show({
        text: ostErrors.getUIErrorMessage('user_not_active'),
        buttonText: 'Okay'
      });
    }
  }

  onRedemptionClick = () => {
    if(!CurrentUser.isUserActivated()){
      Toast.show({
        text: ostErrors.getUIErrorMessage('user_not_active'),
        buttonText: 'Okay'
      });
      return;
    }

    OstWalletSdk.getCurrentDeviceForUserId(CurrentUser.getOstUserId(), ( device )=> {
      if(this.isDevicesAuthorized( device )){
        this.props.navigation.push("RedemptiomScreen");
      }else{
        this.props.navigation.push("AuthDeviceDrawer" , {device: device});
      }
    })
  }

  getWalletIcon = () => {
    if( this.state.isPurchasing ){
      return  <TouchableWithoutFeedback onPress={this.onPurchaseInProgress}>
        <View style={{position: "relative"}}>
          <ProgressCircle size={40} color={Colors.primary} duration={1000} direction="clockwise" useNativeDriver={true}/>
          <Image style={{ width: 18, height: 18, position: 'absolute', top: '50%', left: '50%', transform: [{translateX: -9}, {translateY: -9}] }} source={selfAmountWallet}></Image>
        </View>
      </TouchableWithoutFeedback> ;
    }else{
      return <Image style={{ width: 18, height: 18}} source={selfAmountWallet}></Image> ;
    }
  }

  onStoreClick = () => {
    Utilities.openRedemptionWebView();
  }

  render() {
    return (
      <View style={inlineUserStyles.infoHeaderWrapper}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={this.onTopUp}>
            <View style={{alignItems: 'center'}}>
              <Image style={inlineUserStyles.balanceHeaderIcons} source={topUpIcon}></Image>
              <Text style={inlineProfileStyles.redeemBalance}>Top Up</Text>
            </View>
          </TouchableOpacity>
          <LinearGradient
            colors={['#dadfdc', '#dadfdc']}
            locations={[0, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={inlineUserStyles.dividerLine}
          ></LinearGradient>
          <TouchableOpacity onPress={MultipleClickHandler(() => this.onRedemptionClick())} >
            <View style={{alignItems: 'center'}}>
              <Image style={inlineUserStyles.balanceHeaderIcons} source={pepoCornsImg}></Image>
              <Text style={inlineProfileStyles.redeemBalance}>{AppConfig.redemption.pepoCornsName}</Text>
            </View>
          </TouchableOpacity>
          <LinearGradient
            colors={['#dadfdc', '#dadfdc']}
            locations={[0, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={inlineUserStyles.dividerLine}
          ></LinearGradient>
          <TouchableOpacity onPress={multipleClickHandler(() => {
            this.onStoreClick();
          })} >
            <View style={{alignItems: 'center'}}>
              <Image style={inlineUserStyles.balanceHeaderIcons} source={storeIcon}></Image>
              <Text style={inlineProfileStyles.redeemBalance}>Store</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <View style={{flexDirection: "row", alignItems: 'center'}}>
            {this.getWalletIcon()}
            <Text style={inlineProfileStyles.pepoBalance} {...testProps('balance-header-pepo-amount')}>{' '}{this.toBt(this.props.balance) || 0.00}</Text>
          </View>
          <Text style={inlineProfileStyles.usdBalance} {...testProps('balance-header-usd-amount')}>${' '}{this.toFiat( this.props.balance ) || 0.00} </Text>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(withNavigation( BalanceHeader )) ;
