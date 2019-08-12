import React from 'react';
import { View, Dimensions, Easing, Animated } from 'react-native';
import { Root } from 'native-base';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  createAppContainer
} from 'react-navigation';
import deepGet from 'lodash/get';

import NavigationService from './src/services/NavigationService';
import AuthLoading from './src/components/AuthLoading';
import AuthScreen from './src/components/Authentication';
import SetPin from './src/components/SetPin';
import ConfirmPin from './src/components/ConfirmPin';
import CustomTab from './src/components/CustomTab';
import TransactionScreen from './src/components/Transaction/TransactionScreen';
//import SayThanksScreen from './src/components/SayThanks';
import Colors from './src/theme/styles/Colors';
import ProfileScreen from './src/components/Profile/ProfileScreen';
import ProfileEdit from './src/components/Profile/ProfileEditScreen';
import HomeScreen from './src/components/Home/HomeScreen';
import { LoadingModalCover } from './src/theme/components/LoadingModalCover';
import UserActivatingScreen from './src/components/UserActivating';
import { LoginPopover } from './src/components/LoginPopover';
import UsersProfileScreen from './src/components/UsersProfile';
import SupportingListWrapper from './src/components/SupportingList/SupportingListWrapper';
import SupportersListWrapper from './src/components/SupportersList/SupportersListWrapper';
import CameraWorker from './src/services/CameraWorker';
import PictureWorker from './src/services/PictureWorker';
import UserVideoHistory from './src/components/UserVideoHistory';
import CaptureImage from './src/components/CaptureImage';
import ImageGallery from './src/components/ImageGallery';
import BioScreen from './src/components/Bio';
import CaptureVideo from './src/components/CaptureVideo';
import NotificationScreen from './src/components/Notification';
import { StatusBarManager } from './src/services/StatusBarManager';
import CustomDrawerContent from './src/components/CustomDrawerContent';
import VideoPlayer from './src/components/CommonComponents/VideoPlayer';
import CurrentUser from './src/models/CurrentUser';
import reduxGetter from './src/services/ReduxGetters';

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
      tabBarVisible: routeName == 'TransactionScreen' ? false : true
    };
  }
};

const txModalConfig = {
  transparentCard: true,
  cardStyle: { backgroundColor: 'rgba(0,0,0,0.5)' },
  gesturesEnabled: false,
  transitionConfig: () => ({
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const { index } = scene;

      const height = layout.initHeight;
      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [height, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateY }] };
    }
  })
};

const HomePushStack = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    UsersProfileScreen: UsersProfileScreen,
    UserVideoHistory: UserVideoHistory,
    SupportingListWrapper: SupportingListWrapper,
    SupportersListWrapper: SupportersListWrapper
  },
  {
    headerLayoutPreset: 'center'
  }
);

const HomeStack = createStackNavigator(
  {
    HomePushStack: HomePushStack,
    TransactionScreen: TransactionScreen
  },
  {
    ...modalStackConfig,
    ...txModalConfig
  }
);

const NotificationPushStack = createStackNavigator(
  {
    NotificationScreen: NotificationScreen,
    UsersProfileScreen: UsersProfileScreen,
    UserVideoHistory: UserVideoHistory,
    VideoPlayer: VideoPlayer,
    SupportingListWrapper: SupportingListWrapper,
    SupportersListWrapper: SupportersListWrapper
  },
  {
    headerLayoutPreset: 'center'
  }
);

const NotificationStack = createStackNavigator(
  {
    NotificationPushStack: NotificationPushStack,
    TransactionScreen: TransactionScreen
    //SayThanksScreen: SayThanksScreen
  },
  { ...modalStackConfig, ...txModalConfig }
);

const ProfilePushStack = createStackNavigator(
  {
    ProfileScreen: ProfileScreen,
    UserVideoHistory: UserVideoHistory,
    SupportingListWrapper: SupportingListWrapper,
    SupportersListWrapper: SupportersListWrapper,
    UsersProfileScreen: UsersProfileScreen,
    ProfileEdit: ProfileEdit,
    BioScreen: BioScreen
  },
  {
    headerLayoutPreset: 'center'
  }
);

const ProfileStack = createStackNavigator(
  {
    ProfilePushStack: ProfilePushStack,
    CaptureImageScreen: CaptureImage,
    ImageGalleryScreen: ImageGallery,
    TransactionScreen: TransactionScreen
  },
  {
    headerLayoutPreset: 'center',
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: ({ navigation }) => {
      return {
        tabBarVisible: deepGet(navigation, 'state.index') === 0
      };
    },
    ...txModalConfig
  }
);

const CustomTabStack = createBottomTabNavigator(
  {
    Home: HomeStack,
    Notification: NotificationStack,
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

const DrawerNavigator = createDrawerNavigator(
  {
    CustomTabStack: CustomTabStack
  },
  {
    drawerPosition: 'right',
    drawerBackgroundColor: '#fff',
    overlayColor: 'rgba(0, 0, 0, 0.8)',
    drawerWidth: Dimensions.get('window').width - Dimensions.get('window').width / 5,
    contentComponent: CustomDrawerContent,
    drawerLockMode: 'locked-closed'
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      AuthScreen,
      PinStack,
      UserActivatingScreen,
      DrawerNavigator
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
