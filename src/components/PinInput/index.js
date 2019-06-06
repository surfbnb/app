import React, { Component } from 'react';
import { TextInput } from 'react-native-gesture-handler';

export default class PinInput extends Component {
  constructor() {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Enter Pin</Text>
        <TextInput textContentType="password" />
      </View>
    );
  }
}
