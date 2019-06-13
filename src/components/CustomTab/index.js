import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';

import styles from './styles';
import Feed_icon from '../../assets/feed.png';
import Profile from '../../assets/profile.png';
import friends from '../../assets/friends.png';

export default CustomTab = ({ navigation, screenProps }) => (
  <View style={styles.container}>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Feed');
      }}
    >
      <Image
        tintColor={navigation.state.index === 0 ? '#61b2d6' : 'rgb(72,72,72)'}
        style={styles.tabElement}
        source={Feed_icon}
      />

      <Text style={{ color: navigation.state.index === 0 ? '#61b2d6' : 'rgb(72,72,72)' }}>Feed</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Users')}>
      <Image
        tintColor={navigation.state.index === 1 ? '#61b2d6' : 'rgb(72,72,72)'}
        style={styles.tabElement}
        source={friends}
      />
      <Text style={{ color: navigation.state.index === 1 ? '#ef5566' : 'rgb(72,72,72)' }}>Friends</Text>
    </TouchableOpacity>
    {/* <Text> Pepo </Text> */}
    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
      <Image
        tintColor={navigation.state.index === 2 ? '#61b2d6' : 'rgb(72,72,72)'}
        style={styles.tabElement}
        source={Profile}
      />
      <Text style={{ color: navigation.state.index === 2 ? '#61b2d6' : 'rgb(72,72,72)' }}>Profile</Text>
    </TouchableOpacity>
    {/* <TouchableOpacity style={styles.overlayBtn} /> */}
  </View>
);
