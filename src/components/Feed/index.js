import React, { Component } from 'react';
import { View, Text , Button, Image } from "react-native";



import { styles } from './styles';
import LogoutComponent from './../LogoutLink';



class Feed extends Component {
  static navigationOptions = {
    headerTitle: 'Feed',
    headerRight: <LogoutComponent />
  };

  constructor(props) {
    super(props);
  }

  render() {
  


    return (
      <View>
        Inside Feed
      </View>
    );
  }
}

export default Feed;
