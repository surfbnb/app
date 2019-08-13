import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { StackActions, SafeAreaView } from 'react-navigation';

import styles from './styles';
import homeNs from '../../assets/user-home-icon.png';
import homeSelected from '../../assets/user-home-icon-selected.png';
import profileNs from '../../assets/user-profile-icon.png';
import profileSelected from '../../assets/user-profile-icon-selected.png';
import searchNs from '../../assets/user-search-icon.png';
import searchSelected from '../../assets/user-search-icon-selected.png';
import activityNs from '../../assets/user-activity-icon.png';
import activitySelected from '../../assets/user-activity-icon-selected.png';
import videoNs from '../../assets/user-video-capture-icon.png';
import utilities from '../../services/Utilities';
import NavigationEmitter from '../../helpers/TabNavigationEvent';
import CurrentUser from '../../models/CurrentUser';
import { LoginPopoverActions } from '../../components/LoginPopover';
import appConfig from '../../constants/AppConfig';

let previousTabIndex = 0;

function onTabPressed(navigation, tab) {
  if (CurrentUser.getOstUserId()) {
    loginInFlow(navigation, tab);
  } else {
    logoutFlow(navigation, tab);
  }
}

function loginInFlow(navigation, tab) {
  let currentTabIndex = tab.navigationIndex;
  if (tab.rootStack === 'CaptureVideo') {
    utilities.handleVideoUploadModal(previousTabIndex);
    return;
  }
  if (currentTabIndex == undefined || currentTabIndex == null) return;
  if (previousTabIndex !== currentTabIndex) {
    navigation.navigate(tab.rootStack);
  } else if (utilities.getLastChildRoutename(navigation.state) !== tab.childStack) {
    try {
      navigation.dispatch(StackActions.popToTop());
    } catch {
      console.log('Catch error');
    }
  } else {
    NavigationEmitter.emit('onRefresh', { screenName: tab.childStack });
  }
}

function logoutFlow(navigation, tab) {
  if (tab.navigationIndex == appConfig.tabConfig.tab1.navigationIndex) {
    NavigationEmitter.emit('onRefresh', { screenName: tab.childStack });
  } else {
    LoginPopoverActions.show();
  }
}

const CustomTab = ({ navigation, screenProps }) => {
  previousTabIndex = navigation.state.index;
  return (
    <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
      <TouchableOpacity onPress={() => onTabPressed(navigation, appConfig.tabConfig.tab1)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === appConfig.tabConfig.tab1.navigationIndex ? homeSelected : homeNs}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, appConfig.tabConfig.tab2)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === appConfig.tabConfig.tab2.navigationIndex ? searchSelected : searchNs}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, appConfig.tabConfig.tab3)}>
        <Image style={[styles.tabElementSkipFont]} source={videoNs} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, appConfig.tabConfig.tab4)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === appConfig.tabConfig.tab4.navigationIndex ? activitySelected : activityNs}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, appConfig.tabConfig.tab5)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === appConfig.tabConfig.tab5.navigationIndex ? profileSelected : profileNs}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CustomTab;
