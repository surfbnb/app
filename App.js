import React from 'react';
import { View, Image } from 'react-native';
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
import TransactionScreen from './src/components/Transaction/TransactionScreen';
import BackArrow from './src/assets/back-arrow.png';

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
            headerBackTitle: null,
            headerRight: <LogoutComponent />
          }
        },
        TransactionScreen: {
          screen: TransactionScreen,
          navigationOptions: ({ navigation, screenProps }) => ({
            headerTitle: navigation.getParam('transactionHeader'),
            headerTitleStyle: {
              color: '#484848'
            },
            headerStyle: {
              backgroundColor: '#ffffff'
            },
            headerBackImage: <Image source={BackArrow} style={{ width: 30, height: 18, marginLeft: 20 }} />,
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
          color: '#484848',
          flex: 1,
          textAlign: 'center'
        },
        headerStyle: {
          backgroundColor: '#ffffff'
        },
        headerBackTitle: null
        // headerRight: <LogoutComponent />
      }
    },
    ConfirmPinScreen: {
      screen: ConfirmPin,
      navigationOptions: {
        headerTitle: 'Confirm Pin',
        headerTitleStyle: {
          color: '#484848',
          flex: 1,
          textAlign: 'center'
        },
        headerBackImage: <Image source={BackArrow} style={{ width: 30, height: 18, marginLeft: 20 }} />,
        headerStyle: {
          backgroundColor: '#ffffff'
        },
        headerRight: <View />
        // headerRight: <LogoutComponent />
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
