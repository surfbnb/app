import React, { Component } from 'react';
import {Image, View, TextInput, TouchableOpacity, Text} from 'react-native';
import { SafeAreaView } from 'react-navigation';

import styles from './styles';
import Theme from "../../theme/styles";

import searchNs from '../../assets/user-search-icon.png';
import CrossIcon from "../../assets/cross_icon.png";
import AppConfig from "../../constants/AppConfig";
import PepoPinkIcon from "../../assets/heart.png";
import ProfilePicture from "../ProfilePicture";
import {shortenedFromNow} from "../../helpers/timestampHandling";

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log('search screen');
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{position: 'relative'}}>
          <TouchableOpacity style={styles.iconsPos} activeOpacity={0.7}>
            <Image source={searchNs} style={[styles.searchIconSkipFont]} />
          </TouchableOpacity>
          <TextInput
            editable={true}
            ref="search_query"
            textContentType="none"
            style={[Theme.TextInput.textInputStyle, styles.textInputUi]}
            placeholder="Search People / Usernames"
            returnKeyType="next"
            returnKeyLabel="next"
            placeholderTextColor="rgba(42, 41, 59, 0.4)"
          />
          <TouchableOpacity style={[styles.iconsPos, {right: 0}]}>
            <Image source={CrossIcon} style={[styles.crossIconSkipFont]} />
          </TouchableOpacity>
        </View>
        <View style={styles.txtWrapper}>
          <Image source={PepoPinkIcon} style={styles.systemNotificationIconSkipFont} />
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <Text style={styles.titleName} numberOfLines={1} ellipsizeMode={'tail'}>Thom Yong</Text>
            <Text style={styles.titleHandle} numberOfLines={1} ellipsizeMode={'tail'}>@yong_thom</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default SearchScreen;
