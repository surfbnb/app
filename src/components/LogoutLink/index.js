import React from 'react';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import CurrentUser from '../../models/CurrentUser';

const LogoutLink = (props) => (
  <Text
    style={{
      color: 'rgb(72,72,72)',
      padding: 10
    }}
    onPress={() => {
      CurrentUser.logout(props.navigation.navigate);
    }}
  >
    Logout
  </Text>
);

const LogoutComponent = withNavigation(LogoutLink);

export default LogoutComponent;
