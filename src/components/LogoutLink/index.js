import React, { Component } from 'react';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

const LogoutLink = (props) => (
  <Text
    onPress={async () => {
      await AsyncStorage.removeItem('user');
      props.navigation.navigate('AuthScreen');
    }}
  >
    Logout
  </Text>
);

const LogoutComponent = withNavigation(LogoutLink);

export default LogoutComponent;
