import React, { Component } from 'react';
import  {View} from "react-native";
import BalanceHeader from '../Profile/BalanceHeader';
import LogoutComponent from '../LogoutLink';

import EmptyCoverImage from './EmptyCoverImage'

class ProfileScreen extends Component {
  static navigationOptions = (options) => {
    return {
      headerBackTitle: null,
      headerTitle: 'Profile',
      headerRight: <LogoutComponent {...options} />
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{margin:20,flex:1}}>
        <BalanceHeader  />
        <EmptyCoverImage/>
      </View>
    );
  }
}

export default ProfileScreen;
