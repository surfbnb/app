import React from 'react';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';

import Logout from '../../services/Logout';

const LogoutLink = (props) => (
  <Text
    style={{
      color: '#ffffff',
      padding: 10
    }}
    onPress={async () => {
      let logout = new Logout(props.navigation.navigate);
      await logout.perform();
    }}
  >
    Logout
  </Text>
);

const LogoutComponent = withNavigation(LogoutLink);

export default LogoutComponent;
