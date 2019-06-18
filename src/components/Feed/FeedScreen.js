import React, { Component } from 'react';
import FeedList from "../FeedComponents/FeedList";

class Feed extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Feed'
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing : false
    }
  }

  render() {
      return (
        <FeedList fetchUrl={"/feeds"} ></FeedList>
      );
  }
}

export default Feed;
