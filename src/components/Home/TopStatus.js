import React from 'react';
import {View, Text, Image} from "react-native";
import {connect} from 'react-redux';

import inlineStyles from "./styles";
import selfAmountPlus from "../../assets/self-amount-plus-icon.png";
import selAmountPepo from "../../assets/self-amount-pepo-icon.png";
import CurrentUser from "../../models/CurrentUser";
import Pricer from "../../services/Pricer";

const mapStateToProps = (state) => ({ balance: state.balance });

const getBalance = (props) => {
  return Pricer.getToBT(Pricer.getFromDecimal( props.balance ), 2)|| 0 ;
   // return Pricer.getFromDecimal( props.balance ) || 0 ;
}

const TopStatus = (props) => {
  return CurrentUser.getUserId() && (
    <View style={ inlineStyles.topContainer }>
      <View style={inlineStyles.topBg}>
        <Image
          style={[{height: 16, width: 16}, inlineStyles.topBgPosSkipFont]}
          source={selfAmountPlus}
        />
        <Image
          style={[{height: 13, width: 13}]}
          source={selAmountPepo}
        />
        <Text style={[inlineStyles.topBgTxt]}>{getBalance(props)}</Text>
      </View>
    </View>
  )
};

export default connect(mapStateToProps)(TopStatus);