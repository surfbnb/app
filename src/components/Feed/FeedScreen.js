import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from './styles';
import Toast from '../Toast';

class Feed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.link}>Feed</Text>
        <Toast timeout={3000} />
      </View>
    );
  }
}

export default Feed;
