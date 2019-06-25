import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import styles from './styles';
import feed from '../../assets/user_feed.png';
import profile from '../../assets/user_profile.png';
import friends from '../../assets/user_friends.png';

const tabNames = {
  feedTab: 'FeedContent',
  usersTab: 'Users',
  profileTab: 'ProfileScreen'
};

function onTabPressed(navigation, tabName) {
  try {
    console.log('navigation-----', navigation.getChildNavigation(tabName));
    navigation.dispatch(
      StackActions.reset({
        index: navigation.state.index,
        actions: [NavigationActions.navigate({ routeName: tabName })],
        key: tabName
      })
    );
  } catch {
    console.log('Catch error');
  }
  navigation.navigate(tabName);
}

const CustomTab = ({ navigation, screenProps }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => onTabPressed(navigation, tabNames.feedTab)}>
      <Image
        tintColor={navigation.state.index === 0 ? '#61b2d6' : 'rgb(72,72,72)'}
        style={[styles.tabElementSkipFont, { tintColor: navigation.state.index === 0 ? '#ef5566' : '#484848' }]}
        source={feed}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onTabPressed(navigation, tabNames.usersTab)}>
      <Image
        tintColor={navigation.state.index === 1 ? '#61b2d6' : '#484848'}
        style={[styles.tabElementFriendsSkipFont, { tintColor: navigation.state.index === 1 ? '#ef5566' : '#484848' }]}
        source={friends}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onTabPressed(navigation, tabNames.profileTab)}>
      <Image
        tintColor={navigation.state.index === 2 ? '#61b2d6' : '#484848'}
        style={[styles.tabElementSkipFont, { tintColor: navigation.state.index === 2 ? '#ef5566' : '#484848' }]}
        source={profile}
      />
    </TouchableOpacity>
    {/* <TouchableOpacity style={styles.overlayBtn} /> */}
  </View>
);

export default CustomTab;
