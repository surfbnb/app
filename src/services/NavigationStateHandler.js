import {StatusBar , Platform} from "react-native";
import firebase from 'react-native-firebase';

import Colors from "../theme/styles/Colors";
import NavigationService from './NavigationService';
import AppConfig from '../constants/AppConfig';

const routesWithoutStatusBar = ['Home', 'HomeScreen', 'VideoPlayer', 'CaptureVideo', 'CaptureImageScreen', 'ImageGalleryScreen', 'UserVideoHistory', 'VideoReplies', 'FullScreenVideoCollection', 'FullScreenReplyCollection', 'VideoReplyPlayer'];
const typesToIgnore = ['Navigation/COMPLETE_TRANSITION', 'Navigation/MARK_DRAWER_SETTLING', 'Navigation/MARK_DRAWER_IDLE', 'Navigation/DRAWER_CLOSED'];
const routesAnalyticsMap = AppConfig.routesAnalyticsMap;

let currentState = null;
const StatusBarShow = () => {
  if( Platform.OS === "android"){
    StatusBar.setBackgroundColor(Colors.grey);
    StatusBar.setTranslucent(false);
  }

  if(Platform.OS === "ios"){
    StatusBar.setBarStyle("dark-content")
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

  let routeName = NavigationService.findCurrentRoute(currentState);

  // Status Bar Handler
  routesWithoutStatusBar.includes(routeName) ? StatusBarHide() : StatusBarShow();

  // Analytics screen name Handler
  if(action.type === 'Navigation/BACK'){
    // To ignore back actions
    return;
  }
  let analyticsAction = routesAnalyticsMap[routeName] && routesAnalyticsMap[routeName].trim();

  if(!analyticsAction){
    // Unhandled action
    console.log("Unhandled action: ", action , "Unhandled routeName: " , routeName);
    return;
  }

  console.log('firebase.analytics().setCurrentScreen() ::', analyticsAction);
  firebase.analytics().setCurrentScreen(analyticsAction, analyticsAction);

};
