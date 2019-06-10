import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import styles from './styles';

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  activateUser() {
    // AsyncStorage.getItem('user').then((user) => {
    //   user = JSON.parse(user);
    //   OstWalletSdk.activateUser(
    //     user.user_details.user_id,
    //     pin,
    //     user.user_pin_salt,
    //     86400,
    //     '1000000000000000000',
    //     new ActivateUserCallback()
    //   );
    // });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.activateUser}>
          <Text style={styles.link}>Activate User</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Settings;
