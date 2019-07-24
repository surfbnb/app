import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { StackActions, NavigationActions, SafeAreaView } from 'react-navigation';

import styles from './styles';
import feed from '../../assets/user_feed.png';
import global from '../../assets/user_global.png';
import profile from '../../assets/user_profile.png';
import friends from '../../assets/user_friends.png';
import CurrentUser from '../../models/CurrentUser';

const tabNames = {
  homeTab: 'Home',
  feedTab: 'Feed',
  usersTab: 'Users',
  profileTab: 'Profile'
};

function onTabPressed(navigation, tabName) {
 if (!CurrentUser.checkActiveUser()) return;
  try {
    navigation.dispatch(StackActions.popToTop({ key: tabName }));
  } catch {
    console.log('Catch error');
  }
  navigation.navigate(tabName);
}

const CustomTab = ({ navigation, screenProps }) => (
  <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
    <TouchableOpacity onPress={() => onTabPressed(navigation, tabNames.homeTab)}>
      <Image
        tintColor={navigation.state.index === 0 ? '#61b2d6' : 'rgb(72,72,72)'}
        style={[styles.tabElementSkipFont, { tintColor: navigation.state.index === 0 ? '#ef5566' : '#484848' }]}
        source={global}
      />
      {/*<Text style={[styles.tabElementSkipFont, { color: navigation.state.index === 0 ? '#ef5566' : '#484848' }]}>*/}
      {/*H*/}
      {/*</Text>*/}
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onTabPressed(navigation, tabNames.feedTab)}>
      <Image
        tintColor={navigation.state.index === 1 ? '#61b2d6' : 'rgb(72,72,72)'}
        style={[{ height: 24, width: 28 }, { tintColor: navigation.state.index === 1 ? '#ef5566' : '#484848' }]}
        source={feed}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onTabPressed(navigation, tabNames.usersTab)}>
      <Image
        tintColor={navigation.state.index === 2 ? '#61b2d6' : '#484848'}
        style={[
          styles.tabElementFriendsSkipFont,
          { tintColor: navigation.state.index === 2 ? '#ef5566' : '#484848' }
        ]}
        source={friends}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onTabPressed(navigation, tabNames.profileTab)}>
      <Image
        tintColor={navigation.state.index === 3 ? '#61b2d6' : '#484848'}
        style={[styles.tabElementSkipFont, { tintColor: navigation.state.index === 3 ? '#ef5566' : '#484848' }]}
        source={profile}
      />
    </TouchableOpacity>
  </SafeAreaView>
);

export default CustomTab;
