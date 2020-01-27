import {StatusBar} from "react-native";
import Colors from "../theme/styles/Colors";
import NavigationService from './NavigationService';
import { analyticsSetCurrentScreen } from "../helpers/helpers";
import Utilities from "./Utilities";

const routesWithoutStatusBar = ['Home', 'HomeScreen', 'VideoPlayer', 'CaptureVideo', 'CaptureImageScreen', 'ImageGalleryScreen', 'UserVideoHistory', 'VideoReplies', 'FullScreenVideoCollection', 'FullScreenReplyCollection', 'VideoReplyPlayer'];
const typesToIgnore = ['Navigation/COMPLETE_TRANSITION', 'Navigation/MARK_DRAWER_SETTLING', 'Navigation/MARK_DRAWER_IDLE', 'Navigation/DRAWER_CLOSED'];

const StatusBarShow = () => {
  if( Utilities.isAndroid()){
    StatusBar.setBackgroundColor(Colors.grey);
    StatusBar.setTranslucent(false);
  }

  if(Utilities.isIos()){
    StatusBar.setBarStyle("dark-content")
  }

};

const StatusBarHide = () => {
  if(Utilities.isAndroid()){
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

  analyticsSetCurrentScreen(routeName);

};
