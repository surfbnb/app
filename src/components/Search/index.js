import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log('search screen');
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>SearchScreen</Text>
      </View>
    );
  }
}

export default SearchScreen;
