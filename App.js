import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';

import AuthLoading from './src/components/AuthLoading';
import AuthScreen from './src/components/Authentication';
import Users from './src/components/Users';
import SetPin from './src/components/SetPin';
import ConfirmPin from './src/components/ConfirmPin';
import Settings from './src/components/Settings';
import LogoutComponent from './src/components/LogoutLink';
import CustomTab from './src/components/CustomTab';
import Feed from './src/components/Feed';
import TransactionScreen from './src/components/Transaction/TransactionScreen'

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
            headerTitle: 'Friends',
            headerTitleStyle: {
              color: '#484848'
            },
            headerStyle: {
              backgroundColor: '#ffffff'
            },
            headerRight: <LogoutComponent />
          }
        }
      },
      {
        Transaction: {
          screen : TransactionScreen, 
          navigationOptions: ({ navigation, screenProps }) => ({
            headerTitle: navigation.getParam("transactionHeader"),
            headerTitleStyle: {
              color: '#ffffff'
            },
            headerStyle: {
              backgroundColor: '#61b2d6'
            },
            headerRight: <LogoutComponent />
          })
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
          color: '#484848'
        },
        headerStyle: {
          backgroundColor: '#ffffff'
        },
        headerRight: <LogoutComponent />
      }
    },
    ConfirmPinScreen: {
      screen: ConfirmPin,
      navigationOptions: {
        headerTitle: 'Confirm Pin',
        headerTitleStyle: {
          color: '#484848'
        },
        headerStyle: {
          backgroundColor: '#ffffff'
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
