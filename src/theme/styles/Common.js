import { ifIphoneX , getStatusBarHeight , getBottomSpace} from 'react-native-iphone-x-helper';
import { Dimensions, StatusBar , NativeModules } from 'react-native';

import  NotchHelper from "../../helpers/NotchHelper";
const {width, height} = Dimensions.get('window');
let RNDeviceInfo = NativeModules.RNDeviceInfo;
let modalDeviceName = RNDeviceInfo.model === "Redmi Note 7 Pro" && RNDeviceInfo.brand === "xiaomi";
let btmSpace = modalDeviceName ? 5 : 0;
import { CUSTOM_TAB_Height } from '../../theme/constants';

import DefaultStyleGenerator from './DefaultStyleGenerator';
import Colors from './Colors';

const styles = {
    viewContainer: {
        flex:1, backgroundColor: Colors.white
    },
    modalViewContainer: {
      flex:1,
      backgroundColor:  'rgba(0,0,0,0.5)'
    },

    fullScreen: {
      width: width,
      ...ifIphoneX(
        {
          height: height
        },
        {
          height:
            NotchHelper.hasNotch()
              ? height + statusBarHeight - btmSpace
              : height 
        }
      )
    },

    videoWrapperfullScreen: {
      width: width,
      ...ifIphoneX(
        {
          height: height - CUSTOM_TAB_Height 
        },
        {
          height:
            NotchHelper.hasNotch()
              ? height + statusBarHeight - CUSTOM_TAB_Height - btmSpace
              : height - CUSTOM_TAB_Height
        }
      )
    }
};

export default CommonStyle = DefaultStyleGenerator.generate(styles);
