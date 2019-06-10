import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';

import AuthLoading from './src/components/AuthLoading';
import AuthScreen from './src/components/Authentication';
import Users from './src/components/Users/usersReduxHandler';
import SetPin from './src/components/SetPin';
import ConfirmPin from './src/components/ConfirmPin';
import Settings from './src/components/Settings';
import LogoutComponent from './src/components/LogoutLink';
import SettingsIcon from './src/assets/settings_icon_selected.png';
import UsersIcon from './src/assets/user_icon_selected.png';
import FeedIcon from './src/assets/wallet_icon_selected.png';
import CustomTab from './src/components/CustomTab';
import Feed from './src/components/Feed/feedReduxHandler';

const HomeScreen = createBottomTabNavigator(
  {
    Feed: createStackNavigator(
      {
        FeedContent: {
          screen: Feed,
          navigationOptions: {
            headerTitle: 'Feed',
            headerTitleStyle: {
              color: '#ffffff'
            },
            headerStyle: {
              backgroundColor: '#61b2d6'
            },
            headerRight: <LogoutComponent />
          }
        }
      }
      // {
      //   navigationOptions: {
      //     // tabBarIcon: ({ focused, horizontal, tintColor }) => <Image source={FeedIcon} style={{ tintColor }} />
      //   }
      // }
    ),
    Users: createStackNavigator(
      {
        Users: {
          screen: Users,
          navigationOptions: {
            headerTitle: 'Users',
            headerTitleStyle: {
              color: '#ffffff'
            },
            headerStyle: {
              backgroundColor: '#61b2d6'
            },
            headerRight: <LogoutComponent />
          }
        }
      }
      // {
      //   navigationOptions: {
      //     tabBarIcon: ({ focused, horizontal, tintColor }) => <Image source={UsersIcon} style={{ tintColor }} />
      //   }
      // }
    ),
    Settings: createStackNavigator(
      {
        SettingsScreen: {
          screen: Settings,
          navigationOptions: {
            headerTitle: 'Settings',
            headerTitleStyle: {
              color: '#ffffff'
            },
            headerStyle: {
              backgroundColor: '#61b2d6'
            },
            headerRight: <LogoutComponent />
          }
        }
      }
      // {
      //   navigationOptions: {
      //     tabBarIcon: ({ focused, horizontal, tintColor }) => <Image source={SettingsIcon} style={{ tintColor }} />
      //   }
      // }
    )
  },
  {
    tabBarComponent: CustomTab,
    tabBarPosition: 'bottom'
  }
  // {
  //   tabBarOptions: {
  //     activeTintColor: '#000',
  //     inactiveTintColor: '#000',
  //     style: {
  //       backgroundColor: '#f8f8f8',
  //       height: 100
  //     }
  //   }
  // }
);

const PinStack = createStackNavigator(
  {
    SetPinScreen: {
      screen: SetPin,
      navigationOptions: {
        headerTitle: 'Set Pin',
        headerTitleStyle: {
          color: '#ffffff'
        },
        headerStyle: {
          backgroundColor: '#61b2d6'
        },
        headerRight: <LogoutComponent />
      }
    },
    ConfirmPinScreen: {
      screen: ConfirmPin,
      navigationOptions: {
        headerTitle: 'Confirm Pin',
        headerTitleStyle: {
          color: '#ffffff'
        },
        headerStyle: {
          backgroundColor: '#61b2d6'
        },
        headerRight: <LogoutComponent />
      }
    }
  }
  // {
  //   navigationOptions: {
  //     tabBarIcon: ({ focused, horizontal, tintColor }) => <Image source={SettingsIcon} style={{ tintColor }} />
  //   }
  // }
);

export default createAppContainer(
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
