import {StatusBar , Platform} from "react-native";
import firebase from 'react-native-firebase';

import Colors from "../theme/styles/Colors";
import NavigationService from './NavigationService';

const routesWithoutStatusBar = ['Home', 'HomeScreen', 'VideoPlayer', 'CaptureVideo', 'CaptureImageScreen', 'ImageGalleryScreen', 'UserVideoHistory'];
const typesToIgnore = ['Navigation/COMPLETE_TRANSITION', 'Navigation/MARK_DRAWER_SETTLING', 'Navigation/MARK_DRAWER_IDLE', 'Navigation/DRAWER_CLOSED'];
const routesAnalyticsMap = {
  InAppBrowserStack: 'InAppBrowser',
  UserActivatingScreen: 'UserActivating',
  SetPinScreen: 'SetPin',
  ConfirmPinScreen: 'ConfirmPin',
  Home: 'HomeFeed',
  HomeScreen: 'HomeFeed',
  Search: 'Search',
  Notification: 'Activity',
  Profile: 'MyProfile',
  CaptureVideo: 'CaptureVideo',
  TransactionScreen: 'Transaction',
  UsersProfileScreen: 'UsersProfile',
  SupportingListScreen: 'SupportingList',
  SupportersListScreen: 'SupportersList',
  UserVideoHistory: 'UsersProfile/VideoHistory',
  CaptureImageScreen: 'CaptureImage',
  ImageGalleryScreen: 'ImageGallery',
  StoreProductsScreen: 'InAppPurchase',
  ProfileEdit: 'MyProfile/Edit',
  BioScreen: 'MyProfile/Edit/Bio',
  EmailScreen: 'MyProfile/Edit/Email',
  ReferAndEarn: 'ReferAndEarn',
  Invites: 'Invites',
  WalletSettingScreen: 'WalletSetting',
  WalletDetails: 'WalletDetails',
  SayThanksScreen: 'SayThanks',
  VideoPlayer: 'VideoPlayer',
  InviteCodeScreen: 'InviteCode',
  AddEmailScreen: 'AddEmail',
  InAppBrowserComponent: 'InAppBrowser',
  FanVideoDetails: 'CaptureVideo/VideoDetails',
  ProfileDrawerNavigator: '',
  SearchPushStack: '',
  AuthLoading: '',
  PinStack: '',
  CustomTabStack: '',
  PinPushStack : '',
  AuthDeviceDrawer: '',
  SearchScreen: '',
  ProfilePushStack: '',
  ProfileScreen: '',
  NotificationPushStack: '',
  NotificationScreen: '',
  HomePushStack: '',
  CouchMarks: ''
};

let currentState = null;
const StatusBarShow = () => {
  if( Platform.OS === "android"){
    StatusBar.setBackgroundColor(Colors.grey);
    StatusBar.setTranslucent(false);
  }

};

const StatusBarHide = () => {
  if( Platform.OS === "android"){
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }

};

export const NavigationStateHandler = (prevState, currentState, action) => {

  if(typesToIgnore.includes(action.type)) return;

  console.log('Navigation action ::', action);

  // Status Bar Handler
  let routeName = NavigationService.findCurrentRoute(currentState);
  routesWithoutStatusBar.includes(routeName) ? StatusBarHide() : StatusBarShow();

  // Analytics screen name Handler
  let analyticsAction = routesAnalyticsMap[action.routeName] && routesAnalyticsMap[action.routeName].trim();
  if(analyticsAction && analyticsAction !== ''){
    firebase.analytics().setCurrentScreen(analyticsAction);
  }

};
