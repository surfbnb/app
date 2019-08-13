import {StatusBar , Platform} from "react-native";
import Colors from "../theme/styles/Colors";

const routesWithoutStatusBar = ['Home', 'HomeScreen', 'VideoPlayer', 'CaptureVideo', 'CaptureImageScreen', 'ImageGalleryScreen', 'UserVideoHistory'];
const typesToIgnore = ['Navigation/COMPLETE_TRANSITION', 'Navigation/MARK_DRAWER_SETTLING', 'Navigation/MARK_DRAWER_IDLE', 'Navigation/DRAWER_CLOSED'];

let statusBarStatus = false;
let previousStatusBarStatus = false;

const StatusBarShow = () => {
  if( Platform.OS == "android"){
    StatusBar.setBackgroundColor(Colors.grey);
    StatusBar.setTranslucent(false);
  }
  previousStatusBarStatus = statusBarStatus;
  statusBarStatus = true;
};

const StatusBarHide = () => {
  if( Platform.OS == "android"){
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }
  previousStatusBarStatus = statusBarStatus;
  statusBarStatus = false;
};

export const StatusBarManager = (action) => {

  if(typesToIgnore.includes(action.type)) return;

  console.log('StatusBarManager action ::', action);

  if(action.type === 'Navigation/BACK' || action.type === 'Navigation/POP_TO_TOP') {
    if( previousStatusBarStatus !== statusBarStatus ){
      statusBarStatus ? StatusBarHide() : StatusBarShow();
    }
    return;
  }

  if(action.routeName){
    routesWithoutStatusBar.includes(action.routeName) ? StatusBarHide() : StatusBarShow();
  }

};
