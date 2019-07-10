import React from 'react';
import { View, Dimensions } from 'react-native';
import { Root } from 'native-base';
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
import ProfileScreen from './src/components/Profile/ProfileScreen';
import HomeScreen from './src/components/Home/HomeScreen';
import { LoadingModalCover } from './src/theme/components/LoadingModalCover';
import Giphy from './src/components/Giphy';
import EditTx from './src/components/Transaction/EditTxModal';
import UserActivatingScreen from './src/components/UserActivating';
import deepGet from 'lodash/get';

const transactionScreenParentStackConfig = {
  headerLayoutPreset: 'center',
  headerMode: 'none',
  mode: 'modal',
  navigationOptions: ({ navigation }) => {
    return {
      tabBarVisible: deepGet(navigation, 'state.routes[0].index') == 0 ? true : false
    };
  }
};

const HomeTransactionStack = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    TransactionScreen: TransactionScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const HomeStack = createStackNavigator(
  {
    HomeTransaction: HomeTransactionStack,
    Giphy: Giphy,
    EditTx: EditTx
  },
  { ...transactionScreenParentStackConfig }
);

const FeedStack = createStackNavigator(
  {
    FeedContent: Feed,
    UserFeedScreen: UserFeedScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const UserTransactionStack = createStackNavigator(
  {
    UsersScreen: Users,
    TransactionScreen: TransactionScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const UserStack = createStackNavigator(
  {
    UserTransaction: UserTransactionStack,
    Giphy: Giphy,
    EditTx: EditTx
  },
  { ...transactionScreenParentStackConfig }
);

const ProfileStack = createStackNavigator(
  {
    ProfileScreen: ProfileScreen,
    UserFeedScreen: UserFeedScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const CustomTabStack = createMaterialTopTabNavigator(
  {
    Home: HomeStack,
    Feed: FeedStack,
    Users: UserStack,
    Profile: ProfileStack
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
    },
    lazy: true
  }
);

const PinStack = createStackNavigator(
  {
    SetPinScreen: SetPin,
    ConfirmPinScreen: ConfirmPin
  },
  {
    headerLayoutPreset: 'center',
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
      CustomTabStack,
      PinStack,
      UserActivatingScreen
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);

const RootNavigationContainer = () => (
  <Root>
    <AppContainer
      ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
    <LoadingModalCover />
  </Root>
);

export default RootNavigationContainer;
