import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import { View } from 'react-native';
import { Text, Image } from 'react-native';
import pricer from '../../services/Pricer';
import inlineStyles from './styles';
import pepoTxIcon from '../../assets/pepo-tx-icon.png'
import topUpIcon from '../../assets/top-up-icon.png'
import redeemIcon from '../../assets/redeem-icon.png'

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
      <React.Fragment>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Image style={{ width: 50, height: 50 }} source={topUpIcon}></Image>
            <Text style={inlineStyles.redeemBalance}>Top Up</Text>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Image style={{ width: 50, height: 50 }} source={redeemIcon}></Image>
            <Text style={inlineStyles.redeemBalance}>Redeem</Text>
          </View>
        </View>
        <View>
          <Text>
            <Image style={{ width: 20, height: 20}} source={pepoTxIcon}></Image>{' '}
            <Text style={inlineStyles.pepoBalance}>{this.toBt(this.props.balance) || 0.00}</Text>
          </Text>
          <Text style={inlineStyles.usdBalance}>${this.toFiat( this.props.balance ) || 0.00} </Text>
        </View>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(BalanceHeader) ;
