import React, { PureComponent } from 'react';
import {TouchableOpacity , Image, View, Text} from "react-native";
import QRCode from 'react-native-qrcode-svg';

import inlineStyles from "./style";
import CrossIcon from "../../../assets/cross_icon.png"

export default class QrCode extends PureComponent{
  constructor(props){
    super(props)
  }
  closeModal=()=>{
    this.props.navigation.goBack();
  }
  render(){
    return(
      <View style={inlineStyles.modalContainer}>
        <TouchableOpacity
          onPress={() => {
            this.closeModal();
          }}
          style={inlineStyles.crossIconWrapper}
        >
          <Image source={CrossIcon} style={inlineStyles.crossIconSkipFont} />
        </TouchableOpacity>
        <View style={inlineStyles.modalContentWrapper}>
          <View
            style={inlineStyles.qrCode}>
            <QRCode
              value="http://awesome.link.qr"//{this.props.url}
              color="#ff5566"
              size={130}
            />
          </View>

          <Text style={inlineStyles.modalTextStyle}>{`Scan the QR code to join\n Ethdenver 2020`}</Text>
        </View>
      </View>
      )


  }
}