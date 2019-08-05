import React, { PureComponent } from 'react';

import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity

} from 'react-native';

import CircleCloseIcon from '../../assets/universalCross.png';
import PlusIcon from '../../assets/plus_icon.png';
import appConfig from "../../constants/AppConfig";
import inlineStyles from "./Style";

class GiphySelect extends  PureComponent {

  constructor(props){
    super(props);
  }

  render(){
    let imageSelector;
    if (this.props.selectedGiphy && Object.keys(this.props.selectedGiphy).length) {
      imageSelector = (
        <View  style={{backgroundColor: 'rgba(238,238,238,1)'}}>
          <ActivityIndicator style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
          <ImageBackground
            source={{uri: this.props.selectedGiphy[appConfig.giphySizes.activity].url}}
            style={{ width: '100%', aspectRatio: parseInt(this.props.selectedGiphy[appConfig.giphySizes.activity].width) / parseInt(this.props.selectedGiphy[appConfig.giphySizes.activity].height), position: 'relative' }} >
            <TouchableWithoutFeedback onPress={() =>  {this.props.resetGiphy()}} >
              <Image source={CircleCloseIcon} style={[inlineStyles.crossIconSkipFont, { top: 5, right: 5 }]} />
            </TouchableWithoutFeedback>
          </ImageBackground>
        </View>
      );
    } else {
      imageSelector = (
        <TouchableOpacity onPress={() => { this.props.openGiphy() }} >
          <View style={inlineStyles.giphyPicker}>
            <Image source={PlusIcon} style={inlineStyles.plusIconSkipFont} />
            <Text style={inlineStyles.giphyPickerText}> What do you want to GIF? </Text>
          </View>
        </TouchableOpacity>
      );
    }

  return imageSelector;

  }

}

export default GiphySelect ;