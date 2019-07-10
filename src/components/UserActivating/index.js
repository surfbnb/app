//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Theme from '../../../theme/styles';

// create a component
class UserActivatingScreen extends Component {
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
    backgroundColor: '#2c3e50'
  }
});

//make this component available to the app
export default UserActivatingScreen;
