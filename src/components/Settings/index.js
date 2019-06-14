import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.link}>Profile</Text>
      </View>
    );
  }
}

export default Settings;
