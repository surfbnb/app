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
    this.backgroundColor = this.props.navigation.getParam('backgroundColor');
    this.color = this.props.navigation.getParam('color');
    this.size = this.props.navigation.getParam('size');
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
            style={[inlineStyles.qrCode,{backgroundColor:this.backgroundColor}]}>
            <QRCode
              value={this.url}
              backgroundColor={this.backgroundColor}
              color={this.color}
              size={this.size}
            />
          </View>

          <Text style={inlineStyles.modalTextStyle}>{this.descText}</Text>
        </View>
      </View>
      )


  }
}