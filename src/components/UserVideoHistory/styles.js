import { Dimensions, StatusBar, NativeModules } from 'react-native';

import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import { CUSTOM_TAB_Height } from '../../theme/constants';
import  NotchHelper from "../../helpers/NotchHelper";

const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;

let RNDeviceInfo = NativeModules.RNDeviceInfo;
let modalDeviceName = RNDeviceInfo.model === "Redmi Note 7 Pro" && RNDeviceInfo.brand === "xiaomi";
let btmSpace = modalDeviceName ? 5 : 0;

let stylesMap = {
  fullScreen: {
    width: width,
    ...ifIphoneX(
      {
        height: height - CUSTOM_TAB_Height - getBottomSpace([true])
      },
      {
        height:
          NotchHelper.hasNotch()
            ? height + statusBarHeight - CUSTOM_TAB_Height - btmSpace
            : height - CUSTOM_TAB_Height
      }
    )
  },
  fullHeightSkipFont: {
    width: width,
    height: height
  },
  touchablesBtns: {
    alignSelf: 'flex-end',
    marginBottom: -15,
    zIndex: 1
  },
  pepoTxCount: {
    fontSize: 18,
    color: Colors.white,
    alignSelf: 'center',
    marginTop: 3,
    marginBottom: 15
  },
  txElem: {
    marginBottom: 20
  },
  bottomContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  bottomBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderTopLeftRadius: 20,
    maxHeight: height * 0.20,
    minHeight: height * 0.05
  },
  handle: {
    fontSize: 15,
    color: Colors.white,
    fontFamily: 'AvenirNext-DemiBold'
  },
  bottomBgTxt: {
    color: Colors.white
  },
  raisedSupported: {
    backgroundColor: Colors.wildWatermelon2,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 5,
    width: 120,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  raisedSupportedTxt: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'AvenirNext-DemiBold'
  },
  btnText: {
    color: Colors.white
  },
  playIconSkipFont: {
    position: 'absolute',
    height: 25,
    width: 25,
    top: height * 0.5 - 12,
    left: width * 0.5 - 12
  },
  historyBackSkipFont:{
    ...ifIphoneX({
      top: 55,
    }, {
      top: 25,
    }),
    width: 29,
    height: 34,
    position: 'absolute',
    left: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
