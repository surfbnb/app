import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { ActionSheet } from 'native-base';

import CurrentUser from '../../models/CurrentUser';
import LoadingModal from '../../theme/components/LoadingModal';
import Logout_icon from '../../assets/logout_icon.png';

const BUTTONS = ['Logout', 'Cancel'];
const DESTRUCTIVE_INDEX = 0;
const CANCEL_INDEX = 1;

const LogoutLink = (props) => (
  <React.Fragment>
    {props.navigation && props.navigation.state.routeName === 'ProfileScreen' && (
      <TouchableOpacity
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
        <Image style={{ height: 18, width: 18, marginRight: 20 }} source={Logout_icon} />
      </TouchableOpacity>
    )}
    <LoadingModal />
  </React.Fragment>
);

export default LogoutLink;
