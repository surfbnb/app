import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import { View, Text, Image } from 'react-native';
import pricer from '../../services/Pricer';
import inlineStyles from './styles';
import utilities from '../../services/Utilities';

const mapStateToProps = (state) => ({ balance: state.balance });

class BalanceHeader extends PureComponent {
 
  constructor(props) {
    super(props);
  }

  toBt( val ){
    const priceOracle =  pricer.getPriceOracle() ; 
    val = priceOracle.fromDecimal( val )  ; 
    return priceOracle.toBt( val );
  }

  toFiat( val ){
    const priceOracle =  pricer.getPriceOracle() ; 
    val = priceOracle.fromDecimal( val ); 
    return priceOracle.btToFiat( val );
  }

  render() {
    return (
        <View style={inlineStyles.balanceHeader}>
          <Text style={inlineStyles.balanceToptext}>Your Balance</Text>
          <Text style={inlineStyles.pepoBalance}>
            <Image style={{ width: 25, height: 22 }} source={utilities.getTokenSymbolImageConfig()['image2']}></Image>{' '}
            {this.toBt(this.props.balance)}
          </Text>
          <Text style={inlineStyles.usdBalance}>$ {this.toFiat( this.props.balance )} </Text>
        </View>
    );
  }
}

export default connect(mapStateToProps)(BalanceHeader) ;
