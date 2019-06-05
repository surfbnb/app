import React, { Component } from 'react';
import { View, Text } from 'react-native';

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render(){

    return(
      <View>
        <Text>this.props.navigation</Text>
      </View>
    );
  }
}

export default HomePage;