import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

class Feed extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Feed'
    };
  };

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
