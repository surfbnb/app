import React from 'react';
import { View, Dimensions, Easing, Animated } from 'react-native';
import { Root } from 'native-base';
import {
  createMaterialTopTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';
import deepGet from 'lodash/get';

import NavigationService from './src/services/NavigationService';
import AuthLoading from './src/components/AuthLoading';
import AuthScreen from './src/components/Authentication';
import Users from './src/components/Users';
import SetPin from './src/components/SetPin';
import ConfirmPin from './src/components/ConfirmPin';
import CustomTab from './src/components/CustomTab';
import Activities from './src/components/Activities';
import TransactionScreen from './src/components/Transaction/TransactionScreen';
import Colors from './src/theme/styles/Colors';
import ProfileScreen from './src/components/Profile/ProfileScreen';
import ProfileEdit from './src/components/Profile/ProfileEditScreen';
import HomeScreen from './src/components/Home/HomeScreen';
import { LoadingModalCover } from './src/theme/components/LoadingModalCover';
import Giphy from './src/components/Giphy';
import VideoPlayer from './src/components/CommonComponents/VideoPlayer';
import EditTx from './src/components/Transaction/EditTxModal';
import UserActivatingScreen from './src/components/UserActivating';
import { LoginPopover } from './src/components/LoginPopover';
import UsersProfileScreen from './src/components/UsersProfile';
import CameraWorker from './src/services/CameraWorker';
import PictureWorker from './src/services/PictureWorker';
import UserVideoHistory from './src/components/UserVideoHistory';
import CaptureImage from './src/components/CaptureImage';
import ImageGallery from './src/components/ImageGallery';
import BioScreen from './src/components/Bio';
import CurrentUser from './src/models/CurrentUser';
import { StatusBarManager } from './src/services/StatusBarManager';

const getRouteName = (navigation) => {
  if (!navigation) return null;
  let routeName = deepGet(navigation, 'state.routeName');
  let stateIndex = deepGet(navigation, 'state.index');
  let routes = deepGet(navigation, `state.routes[${stateIndex}]`);
  if (routes) {
    routeName = (routes && routes['routeName']) || routeName;
    stateIndex = routes && routes.index;
    routeName = deepGet(routes, `routes[${stateIndex}].routeName`) || routeName;
  }
  return routeName;
};

const modalStackConfig = {
  headerLayoutPreset: 'center',
  headerMode: 'none',
  mode: 'modal',
  navigationOptions: ({ navigation }) => {
    const routeName = getRouteName(navigation);
    return {
      tabBarVisible: routeName == 'TransactionScreen' || routeName == 'VideoPlayer' ? false : true
    };
  }
};

const HomeTransactionStack = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    UsersProfileScreen: UsersProfileScreen,
    TransactionScreen: TransactionScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const HomeStack = createStackNavigator(
  {
    HomeTransactionStack: HomeTransactionStack,
    Giphy: Giphy,
    EditTx: EditTx,
    VideoPlayer: VideoPlayer
  },
  { ...modalStackConfig }
);

const ActivityTransactionStack = createStackNavigator(
  {
    ActivitiesScreen: Activities,
    UsersProfileScreen: UsersProfileScreen,
    TransactionScreen: TransactionScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const ActivityStack = createStackNavigator(
  {
    ActivityTransactionStack: ActivityTransactionStack,
    Giphy: Giphy,
    EditTx: EditTx,
    VideoPlayer: VideoPlayer
  },
  { ...modalStackConfig }
);

const UserTransactionStack = createStackNavigator(
  {
    UsersScreen: Users,
    UsersProfileScreen: UsersProfileScreen,
    TransactionScreen: TransactionScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const UserStack = createStackNavigator(
  {
    UserTransactionStack: UserTransactionStack,
    Giphy: Giphy,
    EditTx: EditTx,
    VideoPlayer: VideoPlayer
  },
  { ...modalStackConfig }
);

const MyProfileStack = createStackNavigator(
  {
    ProfileScreen: ProfileScreen,
    ProfileEdit: ProfileEdit,
    BioScreen: BioScreen,
    UserVideoHistory: UserVideoHistory
  },
  {
    headerLayoutPreset: 'center'
  }
);

const ProfileStack = createStackNavigator(
  {
    MyProfileStack: MyProfileStack,
    CaptureImageScreen: CaptureImage,
    ImageGalleryScreen: ImageGallery
  },
  {
    headerLayoutPreset: 'center',
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: ({ navigation }) => {
      return {
        tabBarVisible: deepGet(navigation, 'state.index') == 0 ? true : false
      };
    }
  }
);

const CustomTabStack = createMaterialTopTabNavigator(
  {
    Home: HomeStack,
    Activities: ActivityStack,
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
    lazy: true,
    swipeEnabled: false
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
      onNavigationStateChange={(prevState, currentState, action) => StatusBarManager(action)}
      ref={(navigatorRef) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
    />
    <CaptureVideo />
    <CameraWorker />
    <PictureWorker />
    <LoadingModalCover />
    <LoginPopover />
  </Root>
);

export default RootNavigationContainer;
