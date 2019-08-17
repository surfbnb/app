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

  componentWillUpdate(nextProps) {
    if (this.props.userId !== nextProps.userId || this.props.navigation.state.refresh) {
      this.refresh(true, 300);
    }
  }

  refresh = (isRefresh , timeOut=0 ) => {
    const sectionListRef = deepGet(this, "listRef.sectionListRef"),
          list = deepGet(sectionListRef, "props.sections");
    
    if(list && list.length > 0 ){
      sectionListRef && sectionListRef.scrollToLocation({sectionIndex:0, itemIndex: 0});
    }
    setTimeout(()=> {
      isRefresh && this.listRef.refresh();
    } , timeOut)

  }

  componentWillUnmount() {
    NavigationEmitter.removeListener('onRefresh');
  }

  render() {
    return <NotificationList ref={(ref)=>{ this.listRef = ref }} />;
  }
}

export default connect(mapStateToProps)(NotificationScreen);
