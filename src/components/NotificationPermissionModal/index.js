import React from 'react';

import styles from './styles';
import {Text, View, Modal, Platform, TouchableOpacity, Linking} from 'react-native';
import {PushNotificationMethods} from '../../services/PushNotificationManager';
import LinearGradient from "react-native-linear-gradient";
import Theme from "../../theme/styles";
import AndroidOpenSettings from "react-native-android-open-settings";
import utilities from '../../services/Utilities';

function enableAccess() {
    if (Platform.OS == 'android') {
      if (AndroidOpenSettings) {
        AndroidOpenSettings.appDetailsSettings();
      }
    } else {
      Linking.canOpenURL('app-settings:')
        .then((supported) => {
          if (!supported) {
            console.log("Can't handle settings url");
          } else {
            return Linking.openURL('app-settings:');
          }
        })
        .catch((err) => console.error('An error occurred', err));
    }
  }

export default class NotificationPermissionModal extends React.PureComponent{

    constructor( props ){
        super( props );
    }

    handlePermissionButtonClick = () => {

    PushNotificationMethods.askForPNPermission().then(() => {
        console.log('handlePermissionButtonClick.askForPNPermission: then');
    }).catch(() => {
        console.log('handlePermissionButtonClick.askForPNPermission: catch');
        utilities.getItem(`notification-permission-app`).then((value)=> {
        if( value === 'true' || Platform.OS == 'android'){
            enableAccess();
        }
        });
    }).finally(() => {
        console.log('handlePermissionButtonClick.askForPNPermission: finally');
        PushNotificationMethods.getToken(this.props.userId, () => {
            console.log('on callback of getToken');
            utilities.saveItem(`notification-permission-${this.props.userId}`, true);
            utilities.saveItem(`notification-permission-show-${this.props.userId}`, true);
            utilities.saveItem(`notification-permission-app`, true);
        });

        this.props.onPermissionModalDismiss && this.props.onPermissionModalDismiss();
    });
    };

    handlePermissionDismiss = () => {
        utilities.saveItem(`notification-permission-show-${this.props.userId}`, true);
        this.props.onPermissionModalDismiss && this.props.onPermissionModalDismiss();
    };

    render() {
        return (
            <Modal style={styles.backgroundStyle} transparent={true}>
              <View style={styles.wrappedView}>
                <Text style={styles.headerText}>Don't miss out!</Text>

                <Text style={styles.smallText}>
                Get updates about important activity, videos, people, and communities you follow.
                </Text>

                <LinearGradient
                  colors={['#ff7499', '#ff5566']}
                  locations={[0, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ alignSelf: 'center', paddingHorizontal: 15, marginTop: 30, borderRadius: 3 }}>
                  <TouchableOpacity
                    onPress={this.handlePermissionButtonClick}
                    style={[Theme.Button.btn, { borderWidth: 0 }]}>
                    <Text style={[
                      Theme.Button.btnPinkText,
                      { fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center' }
                    ]}>
                      Turn On Notification
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>

                <TouchableOpacity
                    onPress={this.handlePermissionDismiss}
                    style={[Theme.Button.btn, { borderWidth: 0, marginTop: 10 }]}
                >
                  <Text style={[
                    Theme.Button.btnPinkText,
                    { fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center' }
                  ]}>
                    No, Thanks
                  </Text>
                </TouchableOpacity>

              </View>
            </Modal>
          );
    }
}
