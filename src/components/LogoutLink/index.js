import React from 'react';
import { Text } from 'react-native';
import CurrentUser from '../../models/CurrentUser';
import LoadingModal from '../../theme/components/LoadingModal';
import Toast from '../../theme/components/Toast';

const LogoutLink = () => (
  <React.Fragment>
    <Text
      style={{
        color: 'rgb(72,72,72)',
        padding: 10
      }}
      onPress={() => {
        CurrentUser.logout();
      }}
    >
      Logout
    </Text>
    <LoadingModal />
    <Toast timeout={3000} />
  </React.Fragment>
);

export default LogoutLink;
