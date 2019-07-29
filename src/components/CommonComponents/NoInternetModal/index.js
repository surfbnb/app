import React,{PureComponent} from 'react';
import {View,Text,Modal,TouchableOpacity,Image} from 'react-native';

import inlineStyles from './style';
import noInternetIcon from '../../../assets/wireless-error.png';
import crossIcon from '../../../assets/cross_icon_white.png'
import TouchableButton from "../../../theme/components/TouchableButton";
import Theme from "../../../theme/styles";

export default class NoInternetModal extends PureComponent{
  constructor(props){
    super(props)
    this.state = {
      modalVisible: props.modalVisibility
    };

  }
  setModalVisibility = (visibleVal) => {
    this.setState({
      modalVisible: visibleVal
    });
  };

  render(){
    return(


            <View style={{ flex: 1, backgroundColor:'black',paddingTop:'25%' }}>
            <View style={inlineStyles.noInternetContent}>
              <Image source={noInternetIcon} style={inlineStyles.imageDimSkipFont} />
              <Text style={inlineStyles.headerText}>Network Error</Text>
              <Text style={inlineStyles.descText}>Please check your network connection and try again</Text>
              <TouchableButton
                TouchableStyles={[inlineStyles.refreshBtn]}
                TextStyles={[inlineStyles.refreshBtnText]}
                text="Refresh"
              />
            </View>
          </View>


    )
  }
}