import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import PepoApi from './PepoApi';

function deleteToken() {
  firebase
    .messaging()
    .deleteToken()
    .then((res) => {
      console.log('Successfully deleted device token');
    })
    .catch((error) => {
      if (error) console.log('Error occured while deleting device token ', error);
    });
}

class PushNotificationManager extends PureComponent {
  componentDidMount() {
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken) => this.sendToken(fcmToken));
    this.removeNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notification) => console.log('onNotificationOpened', notification));
    this.removeNotificationListener = firebase
      .notifications()
      .onNotification((notification) => console.log('onNotification', notification));
    firebase
      .messaging()
      .hasPermission()
      .then((enabled) => {
        if (!enabled) {
          return firebase.messaging().requestPermission();
        }
      })
      .then(() => {
        console.log('Permission given');
      })
      .catch((error) => {
        console.log('Permission denied');
      });
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
    this.removeNotificationOpenedListener();
    this.removeNotificationListener();
  }

  getToken() {
    firebase
      .messaging()
      .getToken()
      .then((fcmToken) => fcmToken && this.sendToken(fcmToken));
  }

  sendToken(token) {
    if (Object.keys(this.props.current_user).length === 0) {
      console.log('sendToken :: current_user is not yet available');
      return;
    }
    let payload = {
      device_id: DeviceInfo.getUniqueID(),
      device_kind: Platform.OS,
      device_token: token
    };
    new PepoApi(`/users/${this.props.current_user.id}/device-token`).post(payload).then((responseData) => {
      console.log('sendToken :: Payload sent successfully', payload);
    });
  }

  render() {
    this.getToken();
    return <React.Fragment />;
  }
}

const mapStateToProps = ({ current_user }) => ({ current_user });

export default connect(mapStateToProps)(PushNotificationManager);
export const PushNotificationMethods = {
  deleteToken: deleteToken
};
