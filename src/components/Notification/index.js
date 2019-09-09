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
      }
    };
  };

  constructor(props) {
    super(props);
    this.listRef = null;
  }

  componentDidMount() {
    NavigationEmitter.on('onRefresh', (screen) => {
      if (screen.screenName == appConfig.tabConfig.tab4.childStack) {
        this.refresh(true, 300);
      }
    });
    this.props.navigation.addListener('didFocus', () => {
      if (this.props.unreadNotification) {
        this.refresh(true, 300);
        Store.dispatch(upsertNotificationUnread({ flag: 0 }));
      }
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
    this.props.navigation.removeListener('didFocus');
  }

  render() {
    return (
      <NotificationList
        ref={(ref) => {
          this.listRef = ref;
        }}
        fetchUrl={'/notifications'}
      />
    );
  }
}

export default connect(mapStateToProps)(NotificationScreen);
