import {StatusBar , Platform} from "react-native";
import Colors from "../theme/styles/Colors";

let statusBarStatus = false;

const StatusBarShow = () => {
  if( Platform.OS == "android"){
    StatusBar.setBackgroundColor(Colors.grey);
    StatusBar.setTranslucent(false);
  }
  statusBarStatus = true;
};

const StatusBarHide = () => {
  if( Platform.OS == "android"){
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }
  statusBarStatus = false;
};

export const StatusBarManager = (action) => {

  if(action.type === "Navigation/COMPLETE_TRANSITION") return;

  if(action.type === "Navigation/BACK") {
    statusBarStatus ? StatusBarHide() : StatusBarShow();
    return;
  }

  if(!action.routeName) {
    statusBarStatus ? StatusBarShow() : StatusBarHide();
  } else {
    let routesWithoutStatusBar = ['Home', 'VideoPlayer', 'CaptureVideo', 'CaptureImageScreen', 'ImageGalleryScreen'];
    routesWithoutStatusBar.includes(action.routeName) ? StatusBarHide() : StatusBarShow();
  }

};