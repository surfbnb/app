import React, { Component } from 'react';
import { View , FlatList} from 'react-native';

import currentUserModel from "../../models/CurrentUser";
import FeedRow from "../FeedComponents/FeedRow";
import {FetchComponent} from "../FetchComponent";

import styles from './styles';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds : [],
      refreshing : false
    }
  }

  componentWillMount() {
    const url = `/users/${currentUserModel.getUserId()}/feeds/`
    this.fetchComponent = new FetchComponent(url); 
    this.getFeedList();
  }

  componentWillUnmount(){
    this.fetchComponent = null;
    this.setState({ feeds : []});
  }

  getFeedList = () => {
    this.fetchComponent
      .fetch()
      .then(( res ) => {
        this.setState( {feeds : this.fetchComponent.getIDList() })
      })
      .catch((error) => {
        console.log("getFeedList error" , error);
      })
  };

  onRefresh(){
    this.setState({ refreshing  : true  });
    this.fetchComponent
    .refresh()
    .then( ( res) => {
      this.setState({ refreshing  : false , feeds : this.fetchComponent.getIDList() });
    })
    .catch((error)=>{
      this.setState({ refreshing  : false  });
    });
  }

  render() {
    if (this.state.feeds && this.state.feeds.length > 0) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.feeds}
            onEndReached={this.getFeedList}
            onRefresh={()=>{this.onRefresh()}}
            refreshing={this.state.refreshing}
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
