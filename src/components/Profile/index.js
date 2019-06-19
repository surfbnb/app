import React, { Component } from 'react';
import ProfileScreen from './ProfileScreen';
import LogoutComponent from '../LogoutLink';

class Profile extends Component {
  static navigationOptions = (options) => {
    return {
      headerTitle: 'Profile',
      headerRight: <LogoutComponent {...options} />
    };
  };
  constructor(props) {
    super(props);
  }

  render() {
    return <ProfileScreen></ProfileScreen>;
  }
}

export default Profile;
