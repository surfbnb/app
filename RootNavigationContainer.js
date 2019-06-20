import React from 'react';
import { View, Image } from 'react-native';
import {
  createMaterialTopTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';

import NavigationService from './src/services/NavigationService';
import AuthLoading from './src/components/AuthLoading';
import AuthScreen from './src/components/Authentication';
import Users from './src/components/Users';
import SetPin from './src/components/SetPin';
import ConfirmPin from './src/components/ConfirmPin';
import CustomTab from './src/components/CustomTab';
import Feed from './src/components/Feed';
import TransactionScreen from './src/components/Transaction/TransactionScreen';
import Colors from './src/theme/styles/Colors';
import UserFeedScreen from './src/components/UserFeed/UserFeedScreen';
import ProfileScreen from "./src/components/Profile/ProfileScreen";

const HomeScreen = createMaterialTopTabNavigator(
  {
    Feed: createStackNavigator({
      FeedContent: Feed,
      UserFeedScreen: UserFeedScreen
    }),
    Users: createStackNavigator(
      {
        Users: Users,
        TransactionScreen: TransactionScreen
      },
      {
        navigationOptions: ({ navigation }) => ({
          tabBarVisible: navigation.state.index == 1 ? false : true
        })
      }
    ),
    Profile: createStackNavigator({
      ProfileScreen: ProfileScreen,
      UserFeedScreen: UserFeedScreen
    })
  },
  {
    tabBarComponent: CustomTab,
    tabBarPosition: 'bottom',
    defaultNavigationOptions: {
      headerTitleStyle: {
        color: Colors.dark
      },
      headerStyle: {
        backgroundColor: Colors.white
      }
    }
  }
);

const PinStack = createStackNavigator(
  {
    SetPinScreen: SetPin,
    ConfirmPinScreen: ConfirmPin
  },
  {
    defaultNavigationOptions: {
      headerTitleStyle: {
        color: Colors.dark,
        flex: 1,
        textAlign: 'center'
      },
      headerStyle: {
        backgroundColor: Colors.white
      },
      headerRight: <View />
    }
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      AuthScreen,
      HomeScreen,
      PinStack
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);

const RootNavigationContainer = () => (
  <AppContainer
    ref={(navigatorRef) => {
      NavigationService.setTopLevelNavigator(navigatorRef);
    }}
  />
);

export default RootNavigationContainer;
