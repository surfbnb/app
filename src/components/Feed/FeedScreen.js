import React, { Component } from 'react';
import { View, Text , FlatList } from 'react-native';
import deepGet from "lodash/get";

import PepoApi from "../../services/PepoApi";
import styles from './styles';
import FeedRow from '../FeedComponents/FeedRow';


class Feed extends Component {
  constructor(props) {
    super(props);
    this.nextPagePayload = {};
    this.isFetching = false;
  }

  componentDidMount() {
    this.getFeedList();
  }

  getFeedList = () => {
    if (this.isFetching || this.nextPagePayload === null) return;
    if (this.lastPagePayload && this.lastPagePayload === JSON.stringify(this.nextPagePayload)) return;
    this.isFetching = true;
    this.lastPagePayload = JSON.stringify(this.nextPagePayload);

    new PepoApi('/feeds')
      .get(this.nextPagePayload)
      .then((responseData) => {
        if (responseData && responseData.data) {
          this.nextPagePayload = deepGet(responseData, 'data.meta.next_page_payload');
        }
      })
      .catch(console.warn)
      .done(() => {
        this.isFetching = false;
      });
  };

  render() {
    console.log("this.props.public_feed_list" , this.props.public_feed_list);
    if (this.props.public_feed_list.length > 0) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.props.public_feed_list}
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

export default Feed;
