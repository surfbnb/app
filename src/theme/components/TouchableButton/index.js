import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Theme from '../../styles';

const TouchableButton = ({ TouchableStyles, TextStyles, text, onPress }) => (
  <TouchableOpacity style={[Theme.Button.btn, ...TouchableStyles]} onPress={onPress}>
    <Text style={[Theme.Button.btnText, ...TextStyles]}>{text}</Text>
  </TouchableOpacity>
);

export default TouchableButton;
