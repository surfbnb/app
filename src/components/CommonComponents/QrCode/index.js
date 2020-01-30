import React, { PureComponent } from 'react';
import {TouchableOpacity , Image, View, Text} from "react-native";
import QRCode from 'react-native-qrcode-svg';

import inlineStyles from "./style";
import CrossIcon from "../../../assets/cross_icon.png"

export default class QrCode extends PureComponent{
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      headerBackTitle: null,
      header: null
    };
  };
  constructor(props){
    super(props);
    this.url = this.props.navigation.getParam('url') ;
    this.descText = this.props.navigation.getParam('descText');
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
              value={this.url}
              backgroundColor="#ff5566"
              color="#ffffff"
              size={130}
            />
          </View>

          <Text style={inlineStyles.modalTextStyle}>{this.descText}</Text>
        </View>
      </View>
      )


  }
}