import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import CurrentUser from '../../models/CurrentUser';
import NotificationList from './NotificationList';

const mapStateToProps = (state) => {
  return {
    userId: CurrentUser.getUserId()
  };
};

class NotificationScreen extends Component {
  
  static navigationOptions = (options) => {
    return {
      headerTitle: 'Activity'
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <NotificationList fetchUrl={`/users/${this.props.userId}/notifications`} />;
  }
}

export default connect(mapStateToProps)(NotificationScreen);
