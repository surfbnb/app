import React, { PureComponent } from 'react';
import { Platform, AppState } from 'react-native';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import PepoApi from './PepoApi';
import { upsertPushNotification } from '../actions';
import Store from '../store';

function deleteToken() {
  firebase
    .messaging()
    .deleteToken()
    .then((res) => {
      console.log('Successfully deleted device token');
    })
    .catch((error) => console.log('Error occured while deleting device token ', error));
}

class PushNotificationManager extends PureComponent {
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken) => this.sendToken(fcmToken));
    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationData) => notificationData && this.handleGoto(notificationData.notification.data));
    this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationData) => {
      this.handleGoto(notificationData.notification.data);
    });

    this.removeNotificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        if (this.props.currentUserId) {          
          new PepoApi(`/users/${this.props.currentUserId}/reset-badge`)
            .post()
            .then((responseData) => console.log('reset-badge :: responseData', responseData));
        }
      });

    firebase
      .messaging()
      .hasPermission()
      .then((enabled) => {
        if (!enabled) {
          firebase
            .messaging()
            .requestPermission()
            .then(() => {
              firebase.messaging().registerForNotifications();
            })
            .catch((error) => console.log('Permission denied'));
        }
      })
      .catch((error) => console.log('Cannot read permissions'));
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
    this.removeNotificationOpenedListener();
    this.removeNotificationListener();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      this.clearNotifications();
    }
  };

  handleGoto(notificationData) {
    let gotoObject = JSON.parse(notificationData.goto);
    if (Object.keys(gotoObject).length < 0) return;
    Store.dispatch(upsertPushNotification({ goto: gotoObject }));
  }

  getToken() {
    firebase
      .messaging()
      .getToken()
      .then((fcmToken) => fcmToken && this.sendToken(fcmToken));
  }

  sendToken(token) {
    if (!this.props.currentUserId) {
      console.log('sendToken :: currentUserId is not yet available');
      return;
    }
    let payload = {
      device_id: DeviceInfo.getUniqueID(),
      user_timezone: DeviceInfo.getTimezone(),
      device_kind: Platform.OS,
      device_token: token
    };
    this.props.currentUserId &&
      new PepoApi(`/users/${this.props.currentUserId}/device-token`)
        .post(payload)
        .then((responseData) => console.log('sendToken :: Payload sent successfully', responseData));
  }

  clearNotifications() {    
    if (Platform.OS == 'ios') {
      firebase
        .notifications()
        .getBadge()
        .then((count) => {
          if (count > 0) {
            console.log(`clearNotifications :: as badge count (${count}) > 0`);  
            this.clearFirebaseNotifications();      
          }
        });
    } else {
      this.clearFirebaseNotifications();
    }
  }

  clearFirebaseNotifications() {
      // Reset badge and clear notifications on device
      if (this.props.currentUserId) {          
        new PepoApi(`/users/${this.props.currentUserId}/reset-badge`)
          .post()
          .then((responseData) => console.log('reset-badge :: responseData', responseData));
      }
      firebase
        .notifications()
        .removeAllDeliveredNotifications()
        .then((res) => {
          firebase.notifications().setBadge(0);
        })
        .catch((error) => console.log('Error occured while removing notifications ', error));
    
  }

  render() {
    this.getToken();
    return <React.Fragment />;
  }
}

const mapStateToProps = ({ current_user }) => {
  return { currentUserId: current_user.id };
};

export default connect(mapStateToProps)(PushNotificationManager);
export const PushNotificationMethods = {
  deleteToken: deleteToken
};
