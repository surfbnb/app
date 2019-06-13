import React from 'react';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import currentModal from "../../models/CurrentUser";

const LogoutLink = (props) => (
  <Text
    style={{
      color: '#ffffff',
      padding: 10
    }}
    onPress={ () => {
      currentModal.logout( props.navigation.navigate );
    }}
  >
    Logout
  </Text>
);

const LogoutComponent = withNavigation(LogoutLink);

export default LogoutComponent;
