import React, { Component } from 'react';
import { connect } from 'react-redux';
import deepGet from "lodash/get";
import CurrentUser from '../../models/CurrentUser';
import NotificationList from './NotificationList';
import Colors from '../../theme/styles/Colors';
import NavigationEmitter from '../../helpers/TabNavigationEvent';

import appConfig from "../../constants/AppConfig";

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
    this.listRef = null ; 
  }

  componentDidMount() {
    NavigationEmitter.on('onRefresh', (screen) => {
      if (screen.screenName == appConfig.tabConfig.tab4.childStack) {
       this.refresh(true);
      }
    });
  }

  refresh = (isRefresh) => {
    const flatlistProps = deepGet(this, "listRef.flatListHocRef.props");
          flatListRef = deepGet(this, "listRef.flatListHocRef.flatlistRef"),
          list = flatlistProps.list
          ; 
    if(list && list.length > 0 ){
      flatListRef && flatListRef.scrollToIndex({index:0});
    }
    isRefresh && flatlistProps.refresh();
  }

  componentWillUnmount() {
    NavigationEmitter.removeListener('onRefresh');
  }

  render() {
    return <NotificationList ref={(ref)=>{ this.listRef = ref }}  fetchUrl={`/notifications`} />;
  }
}

export default connect(mapStateToProps)(NotificationScreen);
