import React from 'react';
import { Image } from 'react-native';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';

import AuthLoading from './src/components/AuthLoading';
import Authentication from './src/components/Authentication';
import Feed from './src/components/Feed';
import Users from './src/components/Users';
import PinInput from './src/components/PinInput';
import Settings from './src/components/Settings';
import SettingsIcon from './src/assets/settings_icon_selected.png';
import UsersIcon from './src/assets/user_icon_selected.png';
import FeedIcon from './src/assets/wallet_icon_selected.png';

const AppTabNavigator = createBottomTabNavigator(
  {
    Feed: createStackNavigator(
      {
        FeedContent: Feed,
        PinScreen: PinInput
      },
      {
        navigationOptions: {
          tabBarIcon: ({ focused, horizontal, tintColor }) => {
            return <Image source={FeedIcon} style={{ tintColor: tintColor }} />;
          }
        }
      }
    ),
    Users: createStackNavigator(
      {
        Users: Users
      },
      {
        navigationOptions: {
          tabBarIcon: ({ focused, horizontal, tintColor }) => {
            return <Image source={UsersIcon} style={{ tintColor: tintColor }} />;
          }
        }
      }
    ),
    Settings: createStackNavigator(
      {
        SettingsScreen: Settings
      },
      {
        navigationOptions: {
          tabBarIcon: ({ focused, horizontal, tintColor }) => {
            return <Image source={SettingsIcon} style={{ tintColor: tintColor }} />;
          }
        }
      }
    )
  },
  {
    tabBarOptions: {
      activeTintColor: '#168dc1',
      inactiveTintColor: '#9b9b9b'
    }
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoadingScreen: AuthLoading,
      AuthScreen: Authentication,
      Home: AppTabNavigator
    },
    {
      initialRouteName: 'AuthLoadingScreen'
    }
  )
);
