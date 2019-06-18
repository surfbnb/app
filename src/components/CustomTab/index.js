import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import styles from './styles';
import feed from '../../assets/user_feed.png';
import profile from '../../assets/user_profile.png';
import friends from '../../assets/user_friends.png';

const CustomTab = ({ navigation, screenProps }) => (
  <View style={styles.container}>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Feed');
      }}
    >
      <Image
        tintColor={navigation.state.index === 0 ? '#61b2d6' : 'rgb(72,72,72)'}
        style={[styles.tabElement, { tintColor: navigation.state.index === 0 ? '#ef5566' : '#484848' }]}
        source={feed}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Users')}>
      <Image
        tintColor={navigation.state.index === 1 ? '#61b2d6' : '#484848'}
        style={[styles.tabElementFriends, { tintColor: navigation.state.index === 1 ? '#ef5566' : '#484848' }]}
        source={friends}
      />
    </TouchableOpacity>
    {/* <Text> Pepo </Text> */}
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <Image
        tintColor={navigation.state.index === 2 ? '#61b2d6' : '#484848'}
        style={[styles.tabElement, { tintColor: navigation.state.index === 2 ? '#ef5566' : '#484848' }]}
        source={profile}
      />
    </TouchableOpacity>
    {/* <TouchableOpacity style={styles.overlayBtn} /> */}
  </View>
);

export default CustomTab;
