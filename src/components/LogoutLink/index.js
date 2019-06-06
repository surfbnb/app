import React, { Component } from 'react';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import PepoApi from '../../services/PepoApi';
import Logout from '../../services/Logout'

const LogoutLink = (props) => (
  <Text
    onPress={async () => {
      let logout = new Logout(props.navigation.navigate);
      await logout.perform()
    }}
  >
    Logout
  </Text>
);

const LogoutComponent = withNavigation(LogoutLink);

export default LogoutComponent;
