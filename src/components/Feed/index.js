import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from './styles';

import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { TOKEN_ID } from './../../constants';
import AsyncStorage from '@react-native-community/async-storage';

import OstWalletWorkflowCallback from './../../services/OstWalletSdkCallbackImplementation';

class Feed extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initializeDevice();
    this.getFeedData();
  }

  initializeDevice = () => {
    OstWalletSdk.initialize('https://api.stagingost.com/testnet/v2', (err, success) => {
      if (success) {
        this.setupDevice();
      }
    });
  };

  getFeedData = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData, 'responseData');

        this.props.dispatchUpsert(responseData);

        console.log('user-activate responseData:', responseData);
      })
      .catch(console.warn)
      .done();
  };

  setupDevice = () => {
    AsyncStorage.getItem('user').then(async (user) => {
      user = JSON.parse(user);
      OstWalletSdk.setupDevice(user.user_details.user_id, TOKEN_ID, new OstWalletWorkflowCallback());
    });
  };

  render() {
    return (
      <View>
        <FlatList data={this.props.feed} renderItem={({ item }) => <Text style={styles.item}>{item.title}</Text>} />
      </View>
    );
  }
}

export default Feed;
