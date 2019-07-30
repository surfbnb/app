import React from 'react';
import { View, Text } from 'react-native';
import inlineStyles from './styles';

const EmptyList = (props) => {  
  return (
    <View style={inlineStyles.emptyListConatiner}>
      <Text style={inlineStyles.emptyListConatinerText}>{props.displayText}</Text>
    </View>
  );
};

export default EmptyList;
