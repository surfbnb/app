import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import { View, Text, Image } from 'react-native';
import pricer from '../../services/Pricer';
import inlineStyles from './styles';
import utilities from '../../services/Utilities';
import profilelWallet from '../../assets/profile-wallet-icon.png'
import pepoWhiteIcon from '../../assets/pepo-white-icon.png'

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
          <View style={{flex: 0.5, flexDirection: 'row', alignItems: 'center'}}>
            <Image style={{ width: 36.6, height: 36.6 }} source={profilelWallet}></Image>
            <Text style={inlineStyles.balanceToptext}>Balance</Text>
          </View>
          <View style={{flex: 0.5, alignItems: 'flex-end'}}>
            <Text>
              {/*<Image style={{ width: 25, height: 22 }} source={utilities.getTokenSymbolImageConfig()['image2']}></Image>{' '}*/}
              <Image style={{ width: 18, height: 18 }} source={pepoWhiteIcon}></Image>{' '}
              <Text style={inlineStyles.pepoBalance}>{this.toBt(this.props.balance)}</Text>
            </Text>
            <Text style={inlineStyles.usdBalance}>$ {this.toFiat( this.props.balance )} </Text>
          </View>
        </View>
    );
  }
}

export default connect(mapStateToProps)(BalanceHeader) ;
