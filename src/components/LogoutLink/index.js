import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import { ActionSheet } from 'native-base';

import CurrentUser from '../../models/CurrentUser';

const BUTTONS = ['Logout', 'Cancel'];
const DESTRUCTIVE_INDEX = 0;
const CANCEL_INDEX = 1;

const LogoutLink = (props) => (
  <React.Fragment>
    {props.navigation && props.navigation.state.routeName === 'ProfileScreen' && (
      <TouchableOpacity
        style={{height: 32, width: 35,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 20
        }}
        onPress={() => {
          ActionSheet.show(
            {
              options: BUTTONS,
              cancelButtonIndex: CANCEL_INDEX,
              destructiveButtonIndex: DESTRUCTIVE_INDEX,
              title: 'Sure you want to logout?'
            },
            (buttonIndex) => {
              buttonIndex === DESTRUCTIVE_INDEX && CurrentUser.logout();
            }
          );
        }}
      >
        <Text style={{width: 20, height: 2, borderWidth: 1}}></Text>
        <Text style={{width: 20, height: 2, borderWidth: 1, marginVertical: 5}}></Text>
        <Text style={{width: 20, height: 2, borderWidth: 1}}></Text>
      </TouchableOpacity>
    )}
  </React.Fragment>
);

export default LogoutLink;
