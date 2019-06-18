import React, { Component } from 'react';
import { View , FlatList } from 'react-native';
import styles from './styles';
import FeedRow from '../FeedComponents/FeedRow';

import {FetchComponent} from "../FetchComponent";

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds : [],
      refreshing : false,
      progressViewOffset: 0
    }
  }

  componentWillMount() {
    this.fetchComponent = new FetchComponent('/feeds'); 
    this.getFeedList();
  }

  componentWillUnmount(){
    this.fetchComponent = null;
    this.setState({ feeds : []});
  }

  getFeedList = () => {
    this.onFetchStart();
    this.fetchComponent
      .fetch()
      .then(( res ) => {
        this.onFetchEnd();
        this.setState( {feeds : this.fetchComponent.getIDList() })
      })
      .catch((error) => {
        this.onFetchEnd();
        console.log("getFeedList error" , error);
      })
  };

  onFetchStart(){
    this.setState({progressViewOffset: 10});
  }

  onFetchEnd(){
    this.setState({progressViewOffset: 0});
  }

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
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.feeds}
            onEndReached={this.getFeedList}
            onRefresh={()=>{this.onRefresh()}}
            keyExtractor={(item, index) => `id_${item}`}
            onEndReachedThreshold={0.5}
            initialNumToRender={20}
            refreshing={this.state.refreshing}
            progressViewOffset={this.state.progressViewOffset}
            renderItem={({ item }) => (
                <FeedRow id={item} />
            )}
          />
        </View>
      );
  }
}

export default Feed;
