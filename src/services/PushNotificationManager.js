import React, { PureComponent } from 'react';
import {Platform, AppState} from 'react-native';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import PepoApi from './PepoApi';
import { navigateTo } from '../helpers/navigateTo';
import CurrentUser from '../models/CurrentUser';
import NavigationEmitter from '../helpers/TabNavigationEvent';
import Utilities from '../services/Utilities';

let refreshTimeOut = null;
// Not to be used for now
function deleteToken() {
  firebase
    .messaging()
    .deleteToken()
    .then((res) => console.log('Successfully deleted device token with response ',res))
    .catch((error) => console.log('Error occured while deleting device token ', error));
}



function askForPNPermission() {
  return new Promise((resolve, reject)=> {
    firebase
        .messaging()
        .hasPermission()
        .then((enabled) => {
          if (!enabled) {
            firebase
                .messaging()
                .requestPermission()
                .then(() => {
                  console.log('requestPermission: then');
                  //firebase.messaging().registerForNotifications();
                  if(Utilities.isIos()){
                      return resolve();
                  } else {
                    return reject();
                  }

                })
                .catch((error) => {console.log('Permission denied', error); return reject(); });
          } else {
            resolve();
          }

        })
        .catch((error) => {console.log('Cannot read permissions'); return reject(); });
  });

}

function getToken(userId) {
  firebase
      .messaging()
      .getToken()
      .then((fcmToken) => fcmToken && sendToken(fcmToken, userId))
      .catch((error) => console.log('Error occured while getting device token ', error));
}

async function  sendToken(token, userId) {
  if (!userId) {
    console.log('sendToken :: currentUserId is not yet available');
    return;
  }

  let payload = {
    device_id: DeviceInfo.getUniqueId(),
    user_timezone: Utilities.getUTCTimeZone(),
    device_kind: Platform.OS,
    device_token: token
  };


  userId &&
  new PepoApi(`/notifications/device-token`)
      .post(payload)
      .then((responseData) => console.log('sendToken :: Payload sent successfully', responseData))
      .catch((error) => console.log('Error occured in device-token endpoint ', error));
}

function resetUserBadge(userId){
  userId &&
  new PepoApi(`/users/${userId}/reset-badge`)
      .post()
      .then((responseData) => console.log('reset-badge :: responseData', responseData))
      .catch((error) => console.log('Error occured in reset-badge endpoint ', error));
}


class PushNotificationManager extends PureComponent {
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken) => sendToken(fcmToken));

    // getInitialNotification when app is closed and is being launched by clicking on push notification
    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationData) => notificationData && this.handleGoto(notificationData.notification.data))
      .catch((error) => console.log('Error occured in getInitialNotification ', error));

    // onNotificationOpened when app is in background and launched by clicking on push notification
    this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationData) => {
      this.handleGoto(notificationData.notification.data);
      this.clearNotifications();
    });

    this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
      resetUserBadge(this.props.currentUserId);
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
    CurrentUser.getSyncState() &&  navigateTo.shouldNavigate();
    if (CurrentUser.isActiveUser()) {
      gotoObject && gotoObject.pn == 'nc' && this.refreshActivity('NotificationScreen');
    }
  }

  refreshActivity(screenName){
      NavigationEmitter.emit('onRefresh', { screenName });
  }

  clearNotifications() {
    if (Utilities.isIos()) {
      firebase
        .notifications()
        .getBadge()
        .then((count) => {
          if (count > 0) {
            console.log(`clearNotifications :: as badge count (${count}) > 0`);
            this.clearFirebaseNotifications();
          }
        })
        .catch((error) => console.log('Error occured in getBadge ', error));
    } else {
      this.clearFirebaseNotifications();
    }
  }

  clearFirebaseNotifications() {
    // Reset badge and clear notifications on device
    resetUserBadge(this.props.currentUserId);
    firebase
      .notifications()
      .removeAllDeliveredNotifications()
      .then((res) => {
        firebase.notifications().setBadge(0);
      })
      .catch((error) => console.log('Error occured while removing notifications ', error));
  }

  getUserToken(){
    Utilities.getItem(`notification-permission-${this.props.currentUserId}`).then((value)=> {
      value === 'true' && getToken(this.props.currentUserId);
    });
  }

  render() {
    this.getUserToken();
    return <React.Fragment />;
  }
}

const mapStateToProps = ({}) => {
  return { currentUserId: CurrentUser.getUserId() };
};

export default connect(mapStateToProps)(PushNotificationManager);
export const PushNotificationMethods = {
  deleteToken,
  askForPNPermission,
  getToken
};
