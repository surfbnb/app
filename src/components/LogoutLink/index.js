import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import CurrentUser from '../../models/CurrentUser';
import LoadingModal from '../../theme/components/LoadingModal';
import Toast from '../../theme/components/Toast';
import Logout_icon from'../../assets/logout_icon.png'

const LogoutLink = (props) => (

  <React.Fragment>
    {(props.navigation && props.navigation.state.routeName === "ProfileScreen") && (
      <TouchableOpacity
      onPress={() => {
        CurrentUser.logout();
      }}>
      <Image
        style={{height:18,width:18,marginRight:20}}
        source={Logout_icon}
      />
    </TouchableOpacity>)}
    <LoadingModal />
    <Toast timeout={3000} />
  </React.Fragment>
);

export default LogoutLink;
