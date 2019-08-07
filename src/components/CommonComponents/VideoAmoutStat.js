import React, { PureComponent } from 'react';
import {View , Text} from "react-native";
import { connect } from 'react-redux';

import reduxGetter from "../../services/ReduxGetters";

import pricer from "../../services/Pricer";

import inlineStyles from "../Home/styles";

const mapStateToProps = (state, ownProps) => {
    return {
      supporters: reduxGetter.getVideoSupporters( ownProps.videoId ),
      totalBt: reduxGetter.getVideoBt(ownProps.videoId , state ),
    };
  };


class VideoAmountStat extends PureComponent {
    constructor(props) {
        super(props);
      }


    btToFiat(btAmount) {
        const priceOracle = pricer.getPriceOracle();
        btAmount = priceOracle.fromDecimal( btAmount )
        return (priceOracle && priceOracle.btToFiat(btAmount, 2)) || 0;
    }
    
    render() {
    
    return (
        <View style={[inlineStyles.raisedSupported]}>
            {
            <View
                ellipsizeMode={'tail'}
                numberOfLines={1}
            >
                <Text
                style={[inlineStyles.raisedSupportedTxt]}
                ellipsizeMode={'tail'}
                numberOfLines={1}
                >${`${this.btToFiat(this.props.totalBt)}`}{' '}<Text style={{letterSpacing: 0.8, fontFamily: 'AvenirNext-Regular', fontSize: 13}}>RAISED</Text></Text>
            </View>
            }
            {
            <View>
                <Text
                style={[inlineStyles.raisedSupportedTxt]}
                ellipsizeMode={'tail'}
                numberOfLines={1}
                >{`${this.props.supporters}`}{' '}<Text style={{letterSpacing: 0.8, fontFamily: 'AvenirNext-Regular', fontSize: 13}}>SUPPORTERS</Text></Text>
            </View>
            }
        </View>
        );
    }
}


export default connect(mapStateToProps)(VideoAmountStat) ;