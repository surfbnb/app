import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import Theme from '../../theme/styles';
import source from '../../assets/heart.png'

const TouchableButton = ({ TouchableStyles, TextStyles, textBeforeImage, textAfterImage, onPress, imgDimension, buttonText, disabled = false }) => (
  <TouchableOpacity
    style={[Theme.Button.btn, ...TouchableStyles, disabled && Theme.Button.disabled, {flexDirection: 'row', justifyContent: 'center'}]}
    onPress={onPress}
    disabled={disabled}
  >
    {buttonText ?
      <Text  style={[Theme.Button.btnText, ...TextStyles]}>{buttonText}</Text>:
      <React.Fragment>
        <Text style={[Theme.Button.btnText, ...TextStyles]}>{textBeforeImage}</Text>
        <Image source={source} style={{height:20, width: 20}} />
        <Text style={[Theme.Button.btnText, ...TextStyles]}>{textAfterImage}</Text>
      </React.Fragment>
    }
  </TouchableOpacity>
);

export default TouchableButton;
