import {ifIphoneX, getBottomSpace, isIphoneX} from 'react-native-iphone-x-helper';
import { Dimensions, StatusBar } from 'react-native';
import {hasNotch} from "../../helpers/NotchHelper";
import DefaultStyleGenerator from './DefaultStyleGenerator';
import Colors from './Colors';
import { CUSTOM_TAB_Height } from '../../theme/constants';

const statusBarHeight = StatusBar.currentHeight;
const {width, height} = Dimensions.get('window');

const fullScreenHeight = () => {
  return hasNotch() ? height + statusBarHeight : height;
};

const videoWrapperfullScreenHeight = () => {
  return hasNotch() ? height + statusBarHeight - CUSTOM_TAB_Height : height - CUSTOM_TAB_Height;
};

const styles = {
    viewContainer: {
        flex:1, backgroundColor: Colors.white
    },
    modalViewContainer: {
      flex:1,
      backgroundColor:  'rgba(0,0,0,0.5)'
    },
    fullScreenVideoSafeAreaContainer: {
      flex:1,
      backgroundColor: Colors.darkShadeOfGray
    },
    fullScreen: {
      width: width,
      ...ifIphoneX(
        {
          height: height - getBottomSpace()
        },
        {
          minHeight: fullScreenHeight(),
          maxHeight: fullScreenHeight(),
          height: fullScreenHeight()
        }
      )
    },

    videoWrapperfullScreen: {
      width: width,
      ...ifIphoneX(
        {
          height: height - CUSTOM_TAB_Height - getBottomSpace()
        },
        {
          minHeight: videoWrapperfullScreenHeight(),
          maxHeight: videoWrapperfullScreenHeight(),
          height: videoWrapperfullScreenHeight()
        }
      )
    },

    fullHeightWidth: {
      width: "100%",
      height: "100%"
    },
};

// Object.defineProperty(styles.fullScreen, "height", {
//   configurable: true,
//   enumerable: true,
//   get: () => {
//     if ( isIphoneX() ) {
//       return height - getBottomSpace();
//     }
//
//     if ( hasNotch() ) {
//       return height + statusBarHeight;
//     }
//     return height;
//   }
// });
//
// Object.defineProperty(styles.videoWrapperfullScreen, "height", {
//   configurable: true,
//   enumerable: true,
//   get: () => {
//     if ( isIphoneX() ) {
//       return height - CUSTOM_TAB_Height - getBottomSpace();
//     }
//
//     if ( hasNotch() ) {
//       return height + statusBarHeight - CUSTOM_TAB_Height;
//     }
//     return height - CUSTOM_TAB_Height;
//   }
// });

export default CommonStyle = DefaultStyleGenerator.generate(styles);
