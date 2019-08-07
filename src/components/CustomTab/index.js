import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { StackActions, NavigationActions, SafeAreaView } from 'react-navigation';

import styles from './styles';
import feed from '../../assets/user_feed.png';
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
import global from '../../assets/user_global.png';
import profile from '../../assets/user_profile.png';
import friends from '../../assets/user_friends.png';
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
        rootStack: 'CaptureVideo',
        childStack: 'CaptureVideo',
        index: 2
    },
    tab4: {
        rootStack: 'Users',
        childStack: 'UsersScreen',
        index: 3
    },
    tab5: {
        rootStack: 'Profile',
        childStack: 'ProfileScreen',
        index: 4
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
                // tintColor={navigation.state.index === tabConfig.tab1.index ? '#61b2d6' : 'rgb(72,72,72)'}
                style={[
                    styles.tabElementSkipFont
                    // { tintColor: navigation.state.index === tabConfig.tab1.index ? '#ef5566' : '#484848' }
                ]}
                source={navigation.state.index === tabConfig.tab1.index ? homeNs : homeSelected}
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab2)}>
            <Image
                // tintColor={navigation.state.index === tabConfig.tab2.index ? '#61b2d6' : 'rgb(72,72,72)'}
                style={[
                    styles.tabElementSkipFont
                    // { tintColor: navigation.state.index === tabConfig.tab2.index ? '#ef5566' : '#484848' }
                ]}
                source={navigation.state.index === tabConfig.tab2.index ? searchNs : searchSelected}
            />
        </TouchableOpacity>
        <TouchableOpacity>
            <Image
                // tintColor={navigation.state.index === tabConfig.tab2.index ? '#61b2d6' : 'rgb(72,72,72)'}
                style={[
                    styles.tabElementSkipFont
                    // { tintColor: navigation.state.index === tabConfig.tab2.index ? '#ef5566' : '#484848' }
                ]}
                source={videoNs}
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab3)}>
            <Image
                // tintColor={navigation.state.index === tabConfig.tab3.index ? '#61b2d6' : '#484848'}
                style={[
                    styles.tabElementSkipFont
                    // { tintColor: navigation.state.index === tabConfig.tab3.index ? '#ef5566' : '#484848' }
                ]}
                source={navigation.state.index === tabConfig.tab3.index ? activityNs : activitySelected}
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTabPressed(navigation, tabConfig.tab4)}>
            <Image
                // tintColor={navigation.state.index === tabConfig.tab4.index ? '#61b2d6' : '#484848'}
                style={[
                    styles.tabElementSkipFont
                    // { tintColor: navigation.state.index === tabConfig.tab4.index ? '#ef5566' : '#484848' }
                ]}
                source={navigation.state.index === tabConfig.tab4.index ? profileNs : profileSelected}
            />
        </TouchableOpacity>
    </SafeAreaView>)
};

export default CustomTab;
