import React, { PureComponent } from 'react';
import {View, Text, Image} from "react-native";

import inlineStyles from "./styles";
import selfAmountPlus from "../../assets/self-amount-plus-icon.png";


class TopStatus extends PureComponent {

  constructor(props){
    super(props);

  }

  render(){
    return (
      <View style={ inlineStyles.topContainer }>
        <View style={inlineStyles.topBg}>
          <Image
            style={[{height: 18, width: 18}, inlineStyles.topBgPosSkipFont]}
            source={selfAmountPlus}
          />
          <Text style={[inlineStyles.topBgTxt]}>456</Text>
        </View>
      </View>
    )
  }

}

export default TopStatus;