import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import { View, Text, Image } from 'react-native';
import pricer from '../../services/Pricer';
import inlineStyles from './styles';
import utilities from '../../services/Utilities';
import pepoWhiteIcon from '../../assets/pepo-white-icon.png'
import LinearGradient from "react-native-linear-gradient";

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
        <React.Fragment>
          {/*<View style={{flex: 0.5, flexDirection: 'row', alignItems: 'center'}}>*/}
            {/*<Image style={{ width: 36.6, height: 36.6 }} source={profilelWallet}></Image>*/}
            {/*<Text style={inlineStyles.balanceToptext}>Balance</Text>*/}
          {/*</View>*/}
          {/*<View style={{backgroundColor: 'blue'}}>*/}
          <LinearGradient
            colors={['#ff7499', '#ff5566']}
            locations={[0, 1]}
            style={{ borderTopLeftRadius: 20, borderBottomRightRadius: 20, paddingVertical: 8, width: 110, alignItems: 'center'}}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text>
              {/*<Image style={{ width: 25, height: 22 }} source={utilities.getTokenSymbolImageConfig()['image2']}></Image>{' '}*/}
              <Image style={{ width: 20, height: 20}} source={pepoWhiteIcon}></Image>{' '}
              <Text style={inlineStyles.pepoBalance}>{this.toBt(this.props.balance) || 0.00}</Text>
            </Text>
            <Text style={inlineStyles.usdBalance}>${this.toFiat( this.props.balance ) || 0.00} </Text>
          {/*</View>*/}
          </LinearGradient>
        </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(BalanceHeader) ;
