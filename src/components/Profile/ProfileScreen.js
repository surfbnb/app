import React, { Component } from 'react';
import currentUserModel from '../../models/CurrentUser';
import FeedList from '../FeedComponents/FeedList';
import BalanceHeader from '../Profile/BalanceHeader';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toRefresh: false
    };
    this.fetchUrl = `/users/${currentUserModel.getUserId()}/feeds`;
  }

  beforeRefresh() {
    this.setState({ toRefresh: true });
  }

  onRefresh() {
    this.setState({ toRefresh: false });
  }

  onRefreshError() {
    this.setState({ toRefresh: false });
  }

  render() {
    return (
      <FeedList
        style={{ backgroundColor: '#f6f6f6',flex:1 }}
        fetchUrl={this.fetchUrl}
        ListHeaderComponent={<BalanceHeader toRefresh={this.state.toRefresh} />}
        beforeRefresh={() => {
          this.beforeRefresh();
        }}
        onRefresh={(res) => {
          this.refreshDone(res);
        }}
        onRefreshError={(error) => {
          this.onRefreshError(error);
        }}
      ></FeedList>
    );
  }
}

export default ProfileScreen;
