import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import TouchableButton from '../../theme/components/TouchableButton';
import Theme from '../../theme/styles';

// create a component
export default class UserActivatingScreen extends Component {
  onCreatePin() {
    this.props.navigation.navigate('SetPinScreen');
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableButton
          TouchableStyles={[Theme.Button.btnPink, { marginTop: 10 }]}
          TextStyles={[Theme.Button.btnPinkText]}
          text="Create Pin"
          onPress={() => {
            this.onCreatePin();
          }}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});
