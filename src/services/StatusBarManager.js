import {StatusBar , Platform} from "react-native";
import Colors from "../theme/styles/Colors";
import NavigationService from './NavigationService';

const routesWithoutStatusBar = ['Home', 'HomeScreen', 'VideoPlayer', 'CaptureVideo', 'CaptureImageScreen', 'ImageGalleryScreen', 'UserVideoHistory'];
const typesToIgnore = ['Navigation/COMPLETE_TRANSITION'];

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



export const StatusBarManager = (prevState,currentState,action) => {

  if(typesToIgnore.includes(action.type)) return;
  console.log('StatusBarManager action ::', action);
  let routeName = NavigationService.findCurrentRoute(currentState);
  routesWithoutStatusBar.includes(routeName) ? StatusBarHide() : StatusBarShow();

};
