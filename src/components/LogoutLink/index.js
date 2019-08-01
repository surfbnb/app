import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { ActionSheet } from 'native-base';

import CurrentUser from '../../models/CurrentUser';
import Logout_icon from '../../assets/logout_icon.png';

const BUTTONS = ['Logout', 'Cancel'];
const DESTRUCTIVE_INDEX = 0;
const CANCEL_INDEX = 1;

const LogoutLink = (props) => (
  <React.Fragment>
    {props.navigation && props.navigation.state.routeName === 'ProfileScreen' && (
      <TouchableOpacity
        style={{height: 32, width: 32,
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
        <Image style={{ height: 18, width: 18 }} source={Logout_icon} />
      </TouchableOpacity>
    )}
  </React.Fragment>
);

export default LogoutLink;
