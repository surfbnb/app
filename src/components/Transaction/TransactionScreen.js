import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import Giphy from '../Giphy';
import inlineStyles from '../Giphy/styles';

class TransactionScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Giphy />
      </View>
    );
  }
}

export default TransactionScreen;
