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
import Profile from './src/components/Profile';
import LogoutComponent from './src/components/LogoutLink';
import CustomTab from './src/components/CustomTab';
import Feed from './src/components/Feed';
import TransactionScreen from './src/components/Transaction/TransactionScreen';
import Colors from './src/theme/styles/Colors';
import BackArrow from './src/assets/back-arrow.png';

const HomeScreen = createMaterialTopTabNavigator(
  {
    Feed: createStackNavigator({
      FeedContent: {
        screen: Feed,
        navigationOptions: {
          headerTitle: 'Feed',
          headerTitleStyle: {
            color: Colors.dark
          },
          headerStyle: {
            backgroundColor: Colors.white
          }
        }
      }
    }),
    Users: createStackNavigator(
      {
        Users: {
          screen: Users,
          navigationOptions: {
            headerTitle: 'Friends',
            headerTitleStyle: {
              color: Colors.dark
            },
            headerStyle: {
              backgroundColor: Colors.white
            },
            headerBackTitle: null
          }
        },
        TransactionScreen: {
          screen: TransactionScreen,
          navigationOptions: (options) => {
            return {
              headerTitle: options.navigation.getParam('transactionHeader'),
              headerTitleStyle: {
                color: Colors.dark
              },
              headerStyle: {
                backgroundColor: Colors.white
              },
              headerBackImage: <Image source={BackArrow} style={{ width: 10, height: 18, marginLeft: 8 }} />
            };
          }
        }
      },
      {
        navigationOptions: ({ navigation }) => ({
          tabBarVisible: navigation.state.index == 1 ? false : true
        })
      }
    ),
    Profile: createStackNavigator({
      ProfileScreen: {
        screen: Profile,
        navigationOptions: (options) => {
          console.log('options prof', options);
          return {
            headerTitle: 'Profile',
            headerTitleStyle: {
              color: Colors.dark
            },
            headerStyle: {
              backgroundColor: Colors.white
            },
            headerRight: <LogoutComponent {...options} />
          };
        }
      }
    })
  },
  {
    tabBarComponent: CustomTab,
    tabBarPosition: 'bottom'
  }
);

const PinStack = createStackNavigator({
  SetPinScreen: {
    screen: SetPin,
    navigationOptions: {
      headerTitle: 'Set Pin',
      headerTitleStyle: {
        color: Colors.dark,
        flex: 1,
        textAlign: 'center'
      },
      headerStyle: {
        backgroundColor: Colors.white
      },
      headerBackTitle: null
    }
  },
  ConfirmPinScreen: {
    screen: ConfirmPin,
    navigationOptions: {
      headerTitle: 'Confirm Pin',
      headerTitleStyle: {
        color: Colors.dark,
        flex: 1,
        textAlign: 'center'
      },
      headerBackImage: <Image source={BackArrow} style={{ width: 10, height: 18, marginLeft: 20 }} />,
      headerStyle: {
        backgroundColor: Colors.white
      },
      headerRight: <View />
    }
  }
});

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
