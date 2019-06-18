import React, { Component } from 'react';
import FeedList from "../FeedComponents/FeedList";

class Feed extends Component {
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
