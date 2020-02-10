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
import {View} from 'react-native';
import utilities from '../../services/Utilities';

import CommonStyle from "../../theme/styles/Common";
import NotificationPermissionModal from '../NotificationPermissionModal';

const mapStateToProps = (state) => {
  return {
    userId: CurrentUser.getUserId(),
    unreadNotification: reduxGetter.getNotificationUnreadFlag(state)
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
  componentDidUpdate(prevProps, prevState) {
    if (this.props.userId != prevProps.userId|| this.props.navigation.state.refresh) {
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

  onPermissionModalDismiss = () => {
    this.setState({permissionModalVisible: false});
  }

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
          {this.state.permissionModalVisible && 
              <NotificationPermissionModal userId={this.props.userId}
                                            onPermissionModalDismiss={this.onPermissionModalDismiss}/>}
        </View>
      )
    );
  }
}

export default connect(mapStateToProps)(NotificationScreen);
