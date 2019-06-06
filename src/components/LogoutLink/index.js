import React, { Component } from 'react';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import { API_ROOT } from './../../constants';

const LogoutLink = (props) => (
  <Text
    onPress={() => {
      fetch(`${API_ROOT}/users/logout`, {
        method: 'POST',
        credentials: 'include'
      })
        .then((response) => response.json())
        .then(async (responseData) => {
          console.log('Signout responseData:', responseData);
          if (responseData.success) {
            await AsyncStorage.removeItem('user');
            props.navigation.navigate('AuthScreen');
          } else {
            Alert.alert('Error', responseData.msg);
          }
        })
        .catch(console.warn);
    }}
  >
    Logout
  </Text>
);

const LogoutComponent = withNavigation(LogoutLink);

export default LogoutComponent;
