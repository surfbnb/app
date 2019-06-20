import React, { Component } from 'react';
import currentUserModel from '../../models/CurrentUser';
import FeedList from '../FeedComponents/FeedList';
import BalanceHeader from '../Profile/BalanceHeader';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toRefresh: false,
      refreshBalance: false
    };
    this.fetchUrl = `/users/${currentUserModel.getUserId()}/feeds`;
  }

  beforeRefresh() {
    if( !this.state.refreshBalance ){
      this.setState({ refreshBalance: true });
    }
  }

  onRefresh() {
    this.setState({ toRefresh: false , refreshBalance : false });
  }

  onRefreshError() {
    this.setState({ toRefresh: false , refreshBalance : false });
  }

  render() {
    return (
      <FeedList
        style={{ backgroundColor: '#f6f6f6' }}
        fetchUrl={this.fetchUrl}
        toRefresh={ this.state.toRefresh }
        ListHeaderComponent={<BalanceHeader toRefresh={this.state.refreshBalance} />}
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
