import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import CurrentUser from '../../models/CurrentUser';
import NotificationList from './NotificationList';
import Colors from "../../theme/styles/Colors";

const mapStateToProps = (state) => {
  return {
    userId: CurrentUser.getUserId()
  };
};

class NotificationScreen extends Component {
  
  static navigationOptions = (options) => {
    return {
      headerTitle: 'Activity',
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width:0, height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <NotificationList fetchUrl={`/notifications`} />;
  }
}

export default connect(mapStateToProps)(NotificationScreen);
