import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LogoutComponent from './../LogoutLink';

class Settings extends Component {
  static navigationOptions = {
    headerTitle: 'Settings',
    headerRight: <LogoutComponent />
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Inside Settings</Text>
      </View>
    );
  }
}

export default Settings;
