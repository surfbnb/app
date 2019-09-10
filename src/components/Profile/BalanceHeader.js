import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Text, Image } from 'react-native';
import pricer from '../../services/Pricer';
import inlineStyles from './styles';
import selfAmountWallet from '../../assets/pepo-amount-wallet.png';
import topUpIcon from '../../assets/top-up-icon.png'
import redeemIcon from '../../assets/redeem-icon.png'
import inlineStyle from "../CommonComponents/UserInfo/styles";
import LinearGradient from "react-native-linear-gradient";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { withNavigation } from 'react-navigation';
import CurrentUser from '../../models/CurrentUser';
import ProgressCircle from 'react-native-progress/CircleSnail';

import Colors from '../../theme/styles/Colors';

const mapStateToProps = (state) => ({ balance: state.balance });

class BalanceHeader extends PureComponent {
 
  constructor(props) {
    super(props);
    this.state = {
      isPurchasing : false
    }
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  toBt( val ){
    const priceOracle =  pricer.getPriceOracle() ; 
    val = priceOracle.fromDecimal( val )  ; 
    return pricer.toDisplayAmount( priceOracle.toBt( val ) );
  }

  toFiat( val ){
    const priceOracle =  pricer.getPriceOracle() ; 
    val = priceOracle.fromDecimal( val ); 
    return pricer.toDisplayAmount( priceOracle.btToFiat( val ));
  }
  
  onTopUp = () => {
    if(CurrentUser.isUserActivated(true)){
      this.props.navigation.push("StoreProductsScreen");
    }
  }

  getWalletIcon = () => {
    if( this.state.isPurchasing ){
      return  <View style={{position: "relative"}}>
                  <ProgressCircle size={40} color={Colors.primary} duration={1000} direction="clockwise" useNativeDriver={true}/>
                  <Image style={{ width: 18, height: 18, position: 'absolute', transform: [{translateX: 12}, {translateY: 12}] }} source={selfAmountWallet}></Image>
              </View> ;
    }else{
      return <Image style={{ width: 18, height: 18}} source={selfAmountWallet}></Image> ;
          
    }
  }

  render() {
    return (
      <View style={inlineStyle.infoHeaderWrapper}>
        <View style={{flexDirection: 'row'}}>
          <TouchableWithoutFeedback onPress={this.onTopUp}>
            <View style={{alignItems: 'center'}}>
              <Image style={{ width: 50, height: 50 }} source={topUpIcon}></Image>
              <Text style={inlineStyles.redeemBalance}>Top Up</Text>
            </View>
          </TouchableWithoutFeedback>  
          <LinearGradient
            colors={['#dadfdc', '#dadfdc']}
            locations={[0, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{height: 20, width: 1, marginHorizontal: 8, marginTop: 16.5}}
          ></LinearGradient>
          <View style={{alignItems: 'center'}}>
            <Image style={{ width: 50, height: 50 }} source={redeemIcon}></Image>
            <Text style={inlineStyles.redeemBalance}>Redeem</Text>
          </View>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <View style={{flexDirection: "row"}}>
            {this.getWalletIcon()}
            <Text style={inlineStyles.pepoBalance}>{' '}{this.toBt(this.props.balance) || 0.00}</Text>
          </View>
          <Text style={inlineStyles.usdBalance}>${' '}{this.toFiat( this.props.balance ) || 0.00} </Text>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(withNavigation( BalanceHeader )) ;
