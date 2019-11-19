import React, { Component } from 'react';
import { connect } from 'react-redux';
import deepGet from 'lodash/get';

import CurrentUser from '../../models/CurrentUser';
import NotificationList from './NotificationList';
import Colors from '../../theme/styles/Colors';
import NavigationEmitter from '../../helpers/TabNavigationEvent';
import Store from '../../store';
import { upsertNotificationUnread } from '../../actions';
import appConfig from '../../constants/AppConfig';
import reduxGetter from '../../services/ReduxGetters';
import styles from './styles';
import {Text, View, Modal, Platform, Linking, TouchableOpacity} from 'react-native';
import { Button } from 'native-base';
import utilities from '../../services/Utilities';
import {PushNotificationMethods} from '../../services/PushNotificationManager'
import AndroidOpenSettings from "react-native-android-open-settings";
import LinearGradient from "react-native-linear-gradient";
import Theme from "../../theme/styles";

import CommonStyle from "../../theme/styles/Common";

const mapStateToProps = (state) => {
  return {
    userId: CurrentUser.getUserId(),
    unreadNotification: reduxGetter.getNotificationUnreadFlag(state)
  };
};


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
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerTitleStyle: {
        fontFamily: 'AvenirNext-Medium'
      }
    };
  };

  constructor(props) {
    super(props);
    this.listRef = null;
    this.state = {permissionModalVisible:null}
  }

  componentDidMount() {
    NavigationEmitter.on('onRefresh', (screen) => {
      if (screen.screenName == appConfig.tabConfig.tab4.childStack) {
        this.refresh(true, 300);
      }
    });
    this.didFocus = this.props.navigation.addListener('didFocus', (payload) => {
      this.getPermissions();
    });



  }

  getPermissions (){
    utilities.getItem(`notification-permission-show-${this.props.userId}`).then((value)=> {
      let permissionButtonClicked = value === 'true';
      this.setState({permissionModalVisible: !permissionButtonClicked })
    });
  }

  componentWillUpdate(nextProps) {
    if (this.props.userId !== nextProps.userId || this.props.navigation.state.refresh) {
      this.refresh(true, 300);
    }
  }

  refresh = (isRefesh, timeOut = 0) => {
    const sectionListHocProps = deepGet(this, 'listRef.flatListHocRef.props'),
      sectionListRef = deepGet(this, 'listRef.flatListHocRef.sectionListRef'),
      list = sectionListHocProps && sectionListHocProps.list;
    if (list && list.length > 0) {
      sectionListRef && sectionListRef.scrollToLocation({ sectionIndex: 0, itemIndex: 0, viewOffset: 100 });
    }
    setTimeout(() => {
      if (isRefesh) {
        sectionListHocProps && sectionListHocProps.refresh();
      }
    }, timeOut);
  };

  componentWillUnmount() {
    NavigationEmitter.removeListener('onRefresh');
    this.didFocus && this.didFocus.remove && this.didFocus.remove();
  }

  onRefresh = () => {
    if (this.props.unreadNotification) {
      Store.dispatch(upsertNotificationUnread({ flag: 0 }));
    }
  };

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
      utilities.saveItem(`notification-permission-${this.props.userId}`, true);
      utilities.saveItem(`notification-permission-show-${this.props.userId}`, true);
      utilities.saveItem(`notification-permission-app`, true);
      PushNotificationMethods.getToken(this.props.userId);
      this.setState({permissionModalVisible: false});
    });
  }

  handlePermissionDismiss = () => {
    utilities.saveItem(`notification-permission-show-${this.props.userId}`, true);
    this.setState({permissionModalVisible: false});
  }

  showPermissionModal = () => {
    return (
      <Modal style={styles.backgroundStyle} transparent={true}>
        <View style={styles.wrappedView}>
          <Text style={styles.headerText}>This is your Pepo inbox - we'll keep you updated.</Text>

          <Text style={styles.smallText}>
            Make sure to turn "on" notifications so you don't miss important events, like when you receive Pepo Coins or when someone thanks you. We promise to keep it light.
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
  };

  render() {
    return (
      this.props.userId && (
        <View style={CommonStyle.viewContainer}>
          <NotificationList
            ref={(ref) => {
              this.listRef = ref;
            }}
            fetchUrl={'/notifications'}
            onRefresh={this.onRefresh}
          />
          {this.state.permissionModalVisible && this.showPermissionModal()}
        </View>
      )
    );
  }
}

export default connect(mapStateToProps)(NotificationScreen);
