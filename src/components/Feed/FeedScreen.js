import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from './styles';

class Feed extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getFeedData();
  }

  getFeedData = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData, 'feed data');

        this.props.dispatchUpsert(responseData);
      })
      .catch(console.warn)
      .done();
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.props.feed}
          keyExtractor={(item, index) => String(item.id)}
          renderItem={({ item }) => (
            <Text id={item.id} style={styles.item}>
              {item.title}
            </Text>
          )}
        />
      </View>
    );
  }
}

export default Feed;
