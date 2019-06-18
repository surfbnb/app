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
  }

  render() {
      return (
        <FeedList fetchUrl={"/feeds"} nestedNavigation={true}></FeedList>
      );
  }
}

export default Feed;
