import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import Theme from '../../styles';
import air_drop from '../../../assets/airdrop.png';

const TouchableButton = ({ TouchableStyles, TextStyles, text, onPress, source, imgDimension, disabled = false }) => (
  <TouchableOpacity
    style={[Theme.Button.btn, ...TouchableStyles, disabled && Theme.Button.disabled]}
    onPress={onPress}
    disabled={disabled}
  >
    <Image source={source} style={imgDimension} />
    <Text style={[Theme.Button.btnText, ...TextStyles]}>{text}</Text>
  </TouchableOpacity>
);

export default TouchableButton;
