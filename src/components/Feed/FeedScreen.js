import React, { Component } from 'react';
import FeedList from '../FeedComponents/FeedList';

class Feed extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Feed',
      headerBackTitle: null
    };
  };

  constructor(props) {
    super(props);
    this.props.navigation.tab = "Feed"; 
  }

  render() {
    return <FeedList style={{ backgroundColor: '#f6f6f6' }} fetchUrl={'/feeds'} navigation={this.props.navigation} ></FeedList>;
  }
}

export default Feed;
