import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { StackActions, NavigationActions, SafeAreaView } from 'react-navigation';

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
import videoSelected from '../../assets/user-video-capture-icon-selected.png';
import CurrentUser from '../../models/CurrentUser';

const tabConfig = {
  tab1: {
    rootStack: 'Home',
    childStack: 'HomeScreen',
    index: 0
  },
  tab2: {
    rootStack: 'Activities',
    childStack: 'ActivitiesScreen',
    index: 1
  },
  tab3: {
    rootStack: 'Users',
    childStack: 'UsersScreen',
    index: 2
  },
  tab4: {
    rootStack: 'Profile',
    childStack: 'ProfileScreen',
    index: 3
  }
};

let previousTabIndex = 0;

let recursiveMaxCount = 0;

function getLastChildRoutename(state) {
  if (!state) return null;
  let index = state.index,
    routes = state.routes;
  if (!routes || recursiveMaxCount > 10) {
    recursiveMaxCount = 0;
    return state.routeName;
  }
  recursiveMaxCount++;
  console.log('recursiveMaxCount', recursiveMaxCount);
  return getLastChildRoutename(routes[index]);
}

function onTabPressed(navigation, tab) {
  if (!CurrentUser.checkActiveUser()) return;
  if (previousTabIndex != tab.index) {
    navigation.navigate(tab.rootStack);
  } else {
    try {
      if (getLastChildRoutename(navigation.state) !== tab.childStack) {
        navigation.dispatch(StackActions.popToTop());
      }
    } catch {
      console.log('Catch error');
    }
  }
}

const CustomTab = ({ navigation, screenProps }) => {
  previousTabIndex = navigation.state.index
   return ( <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
      <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab1)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === tabConfig.tab1.index ? homeSelected : homeNs}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab2)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === tabConfig.tab2.index ? searchSelected : searchNs}
        />
      </TouchableOpacity>
     <TouchableOpacity>
       <Image
         style={[styles.tabElementSkipFont]}
         source={videoNs}
       />
     </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab3)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === tabConfig.tab3.index ? activitySelected : activityNs}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab4)}>
        <Image
          style={[styles.tabElementSkipFont]}
          source={navigation.state.index === tabConfig.tab4.index ? profileSelected : profileNs}
        />
      </TouchableOpacity>
    </SafeAreaView>)
 };

export default CustomTab;
