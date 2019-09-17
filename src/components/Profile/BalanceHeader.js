import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import { View } from 'react-native';
import { Text, Image } from 'react-native';
import pricer from '../../services/Pricer';
import inlineStyles from './styles';
import selfAmountWallet from '../../assets/pepo-amount-wallet.png';
import topUpIcon from '../../assets/top-up-icon.png'
import redeemIcon from '../../assets/redeem-icon.png'
import inlineStyle from "../CommonComponents/UserInfo/styles";
import LinearGradient from "react-native-linear-gradient";

const mapStateToProps = (state) => ({ balance: state.balance });

class BalanceHeader extends PureComponent {

  constructor(props) {
    super(props);
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

  render() {
    return (
      <View style={inlineStyle.infoHeaderWrapper}>
        <View style={{flexDirection: 'row'}}>
          {/*<View style={{alignItems: 'center'}}>*/}
            {/*<Image style={{ width: 50, height: 50 }} source={topUpIcon}></Image>*/}
            {/*<Text style={inlineStyles.redeemBalance}>Top Up</Text>*/}
          {/*</View>*/}
          {/*<LinearGradient*/}
            {/*colors={['#dadfdc', '#dadfdc']}*/}
            {/*locations={[0, 1]}*/}
            {/*start={{ x: 0, y: 0 }}*/}
            {/*end={{ x: 1, y: 0 }}*/}
            {/*style={{height: 20, width: 1, marginHorizontal: 8, marginTop: 16.5}}*/}
          {/*></LinearGradient>*/}
          {/*<View style={{alignItems: 'center'}}>*/}
            {/*<Image style={{ width: 50, height: 50 }} source={redeemIcon}></Image>*/}
            {/*<Text style={inlineStyles.redeemBalance}>Redeem</Text>*/}
          {/*</View>*/}
          <View style={{alignItems: 'center'}}>
            <Text style={inlineStyles.balanceLabel}>Balance</Text>
          </View>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text>
            <Image style={{ width: 18, height: 18}} source={selfAmountWallet}></Image>{' '}
            <Text style={inlineStyles.pepoBalance}>{this.toBt(this.props.balance) || 0.00}</Text>
          </Text>
          <Text style={inlineStyles.usdBalance}>${' '}{this.toFiat( this.props.balance ) || 0.00} </Text>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(BalanceHeader) ;
