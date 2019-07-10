import React , {PureComponent} from 'react';
import {View, Text, Image} from "react-native";
import {connect} from 'react-redux';

import inlineStyles from "./styles";
import selfAmountPlus from "../../assets/self-amount-plus-icon.png";
import selAmountPepo from "../../assets/self-amount-pepo-icon.png";

const mapStateToProps = (state) => ({ balance: state.balance });

const TopStatus = (props) => {
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
        <Text style={[inlineStyles.topBgTxt]}>{props.balance || 0}</Text>
      </View>
    </View>
  )
};

export default connect(mapStateToProps)(TopStatus);