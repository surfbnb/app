import React, { Component } from 'react';
import {View, Text, Image} from "react-native";

import inlineStyles from "./styles";
import selfAmountPlus from "../../assets/self-amount-plus-icon.png";
import selAmountPepo from "../../assets/self-amount-pepo-icon.png";


const TopStatus = function (props) {
  return (
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
        <Text style={[inlineStyles.topBgTxt]}>456</Text>
      </View>
    </View>
  )
};


export default TopStatus;