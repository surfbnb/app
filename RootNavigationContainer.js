import React from 'react';
import { View, Dimensions, Easing, Animated } from 'react-native';
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
import VideoPlayer from './src/components/CommonComponents/VideoPlayer';
import EditTx from './src/components/Transaction/EditTxModal';
import UserActivatingScreen from './src/components/UserActivating';
import { LoginPopover } from './src/components/LoginPopover';
import UsersProfileScreen from './src/components/UsersProfile';
import CameraWorker from './src/services/CameraWorker';
import PictureWorker from './src/services/PictureWorker';
import CaptureVideo from './src/components/CaptureVideo';
import PreviewRecordedVideo from './src/components/PreviewRecordedVideo';
import CaptureImage from './src/components/CaptureImage';
import ImageGallery from './src/components/ImageGallery';
import BioScreen from './src/components/Bio';
import CurrentUser from './src/models/CurrentUser'
import deepGet from 'lodash/get';

const modalStackConfig = {
  headerLayoutPreset: 'center',
  headerMode: 'none',
  mode: 'modal',
  navigationOptions: ({ navigation }) => {
    return {
      swipeEnabled:CurrentUser.getOstUserId()?true:false,
      tabBarVisible: deepGet(navigation, 'state.routes[0].index') == 0 ? true : false
    };
  }
};

const UserTransactionStack = createStackNavigator(
  {
    UsersScreen: Users,
    UsersProfileScreen: UsersProfileScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const HomeTransactionStack = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    TransactionScreen: TransactionScreen,
    UsersProfileScreen: UsersProfileScreen
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

const FeedStack = createStackNavigator(
  {
    FeedContent: Feed,
    UserFeedScreen: UserFeedScreen
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
  { ...modalStackConfig }
);

const ProfileStack = createStackNavigator(
  {
    ProfileScreen: ProfileScreen,
    VideoPlayer: VideoPlayer,
    CaptureVideo: CaptureVideo,
    BioScreen: BioScreen,
    CaptureImageScreen: CaptureImage,
    ImageGalleryScreen: ImageGallery
  },
  {
    headerLayoutPreset: 'center',
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
    
    <CameraWorker />
    <PictureWorker />
    <LoadingModalCover />
    <LoginPopover />
  </Root>
);

export default RootNavigationContainer;
