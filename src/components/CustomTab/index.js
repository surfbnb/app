import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';

import styles from './styles';
import Feed_icon from '../../assets/wallet_icon_selected.png';
import Settings_icon from '../../assets/settings_icon_selected.png';
import User_icon from '../../assets/user_icon_selected.png';
import Friends_icon from '../../assets/settings_icon_selected.png';

export default (CustomTab = ({ navigation, screenProps }) => (
  <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
           navigation.navigate('Feed');
          }}
        >
          <Image
            tintColor={navigation.state.index === 0 ? '#61b2d6' : '#A9A9A9'}
            style={styles.tabElement}
            source={Feed_icon}
          />

          <Text>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            tintColor={navigation.state.index === '' ? '#61b2d6' : '#A9A9A9'}
            style={styles.tabElement}
            source={Settings_icon}
          />
          <Text>Friends</Text>
        </TouchableOpacity>
        <Text> Pepo </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Users')}>
          <Image
            tintColor={navigation.state.index === 1 ? '#61b2d6' : '#A9A9A9'}
            style={styles.tabElement}
            source={User_icon}
          />
          <Text>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            tintColor={navigation.state.index === 2 ? '#61b2d6' : '#A9A9A9'}
            style={styles.tabElement}
            source={Friends_icon}
          />
          <Text>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.overlayBtn}></TouchableOpacity>
      </View>
  ));