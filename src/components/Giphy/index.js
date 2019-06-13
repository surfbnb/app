import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import inlineStyles from './styles';

class Giphy extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={inlineStyles.giphyPicker}>
        <Text> What do you want to GIF? </Text>
      </View>
    );
  }
}

export default Giphy;
