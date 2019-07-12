import React from 'react';
import {View, Text, Image} from "react-native";
import {connect} from 'react-redux';

import inlineStyles from "./styles";
import selfAmountPlus from "../../assets/self-amount-plus-icon.png";
import selAmountPepo from "../../assets/self-amount-pepo-icon.png";
import currentUserModel from "../../models/CurrentUser";
import Pricer from "../../services/Pricer";
import PriceOracle from "../../services/PriceOracle";
import deepGet from "lodash/get";

const mapStateToProps = (state) => ({ balance: state.balance });

const getBalance = (props) => {
  let decimal = deepGet(Pricer , "token.decimals") , 
      balance = PriceOracle.fromDecimal( props.balance , decimal )
   ; 
   balance = PriceOracle.toBt( balance ) ; 
   return balance || 0 ;
}

const TopStatus = (props) => {
  return currentUserModel.getOstUserId() && (
    <View style={ inlineStyles.topContainer }>
      <View style={inlineStyles.topBg}>
        <Image
          style={[{height: 18, width: 18}, inlineStyles.topBgPosSkipFont]}
          source={selfAmountPlus}
        />
        <Image
          style={[{height: 15, width: 15}]}
          source={selAmountPepo}
        />
        <Text style={[inlineStyles.topBgTxt]}>{getBalance(props)}</Text>
      </View>
    </View>
  )
};

export default connect(mapStateToProps)(TopStatus);