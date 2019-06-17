import React, { Component } from 'react';
import { View , FlatList} from 'react-native';
import deepGet from 'lodash/get';

import currentUserModel from "../../models/CurrentUser";
import FeedRow from "../FeedComponents/FeedRow";
import {FetchComponent} from "../FetchComponent";

import styles from './styles';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const url = `/user/${currentUserModel.getUserId()}/feeds`
    this.fetchComponent = new FetchComponent(url); 
    this.getFeedList();
  }

  componentWillUnmount(){
    this.fetchComponent = null;
    this.setState({ feeds : []});
  }

  getFeedList = () => {
    return ;
    this.fetchComponent
      .fetch()
      .then(( res ) => {
        this.setState( {feeds : this.fetchComponent.getIDList() })
      })
      .catch((error) => {
        console.log("getFeedList error" , error);
      })
  };

  render() {
    if (this.props.user_feed && this.props.user_feed.length > 0) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.props.user_feed}
            onEndReached={this.getFeedList}
            keyExtractor={(item, index) => `id_${item}`}
            onEndReachedThreshold={0.5}
            initialNumToRender={20}
            renderItem={({ item }) => (
              <FeedRow id={item} />
            )}
          />
        </View>
      );
    }
    return <View></View>;
  }
}

export default ProfileScreen;
