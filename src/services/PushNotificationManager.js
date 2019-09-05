import React, { PureComponent } from 'react';
import { Platform, AppState } from 'react-native';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import PepoApi from './PepoApi';
import { upsertPushNotification } from '../actions';
import Store from '../store';
import NavigateTo from '../helpers/navigateTo';

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

    this.removeNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notification) => this.handleGoto(notificationData.notification.data));

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
        // Implement screen?
      });
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
    // if (Object.keys(this.props.current_user).length === 0) {
    // Dispatch to redux
    console.log(notificationData.goto, 'notificationData.notification.data.goto');
    let gotoObject = JSON.parse(notificationData.goto);
    if (Object.keys(gotoObject).length < 0) return;
    console.log('PushNotificationManager: handleGoto');
    Store.dispatch(upsertPushNotification({ goto: gotoObject }));
    // } else {
    //   // goto
    //   pushNotificationEvent.emit('goToPage', notificationData)
    // }
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
      device_kind: Platform.OS,
      device_token: token
    };
    new PepoApi(`/users/${this.props.currentUserId}/device-token`)
      .post(payload)
      .then((responseData) => console.log('sendToken :: Payload sent successfully', payload));
  }

  clearNotifications() {
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
