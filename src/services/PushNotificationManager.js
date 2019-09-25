import React, { PureComponent } from 'react';
import { Platform, AppState } from 'react-native';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import PepoApi from './PepoApi';
import { navigateTo } from '../helpers/navigateTo';
import CurrentUser from '../models/CurrentUser';
import reduxGetter from '../services/ReduxGetters';
import NavigationEmitter from '../helpers/TabNavigationEvent';


let refreshTimeOut = null;
// Not to be used for now
function deleteToken() {
  firebase
    .messaging()
    .deleteToken()
    .then((res) => console.log('Successfully deleted device token with response ',res))
    .catch((error) => console.log('Error occured while deleting device token ', error));
}

class PushNotificationManager extends PureComponent {
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken) => this.sendToken(fcmToken));

    // getInitialNotification when app is closed and is being launched by clicking on push notification
    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationData) => notificationData && this.handleGoto(notificationData.notification.data));

    // onNotificationOpened when app is in background and launched by clicking on push notification
    this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationData) => {
      this.handleGoto(notificationData.notification.data);
      this.clearNotifications();
    });

    this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
      if (this.props.currentUserId) {
        new PepoApi(`/users/${this.props.currentUserId}/reset-badge`)
          .post()
          .then((responseData) => console.log('reset-badge :: responseData', responseData));
      }
    });
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
    this.removeNotificationOpenedListener();
    this.removeNotificationListener();
    if (this._handleAppStateChange) {
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      this.clearNotifications();
    }
  };

  handleGoto(notificationData) {
    let gotoObject = JSON.parse(notificationData.goto);
    if (Object.keys(gotoObject).length < 0) return;
    navigateTo.setGoTo(gotoObject);
    navigateTo.shouldNavigate();
    if (CurrentUser.isActiveUser()) {
      gotoObject.pn == 'nc' && this.refreshActivity('NotificationScreen');
    }
  }

  refreshActivity(screenName){
      NavigationEmitter.emit('onRefresh', { screenName });
  }

  getToken() {
    firebase
      .messaging()
      .getToken()
      .then((fcmToken) => fcmToken && this.sendToken(fcmToken));
  }

  askForPermission() {
    if (this.props.currentUserId) {
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
      new PepoApi(`/notifications/device-token`)
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
    this.askForPermission();
    return <React.Fragment />;
  }
}

const mapStateToProps = ({}) => {
  return { currentUserId: CurrentUser.getUserId() };
};

export default connect(mapStateToProps)(PushNotificationManager);
export const PushNotificationMethods = {
  deleteToken
};
