import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from './styles';

class Feed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.link}>Feed</Text>
      </View>
    );
  }
}

export default Feed;
