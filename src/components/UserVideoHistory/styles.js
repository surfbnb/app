import { Dimensions, StatusBar, NativeModules } from 'react-native';

import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import {ifIphoneX, getBottomSpace, isIphoneX} from 'react-native-iphone-x-helper';
import { CUSTOM_TAB_Height } from '../../theme/constants';
import  {hasNotch} from "../../helpers/NotchHelper";

const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;

let stylesMap = {
  fullScreen: {
    width: width
  },
  fullHeightWidth: {
    width: "100%",
    height: "100%"
  },
  touchablesBtns: {
    alignItems: 'flex-end',
    marginBottom: -10,
    zIndex: 1,
    flexDirection: 'row'
  },
  invertedList: {
    marginRight: 'auto',
    minWidth: '20%',
    marginBottom: 40
  },
  pepoTxCount: {
    fontSize: 18,
    color: Colors.white,
    alignSelf: 'center',
    marginTop: 3,
    marginBottom: 5
  },
  txElem: {
    marginBottom: 20
  },
  bottomContainer: {
    width: width,
    position: 'absolute',
    bottom: 0
  },
  bottomBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderTopLeftRadius: 20,
    minHeight: height * 0.05,
    paddingHorizontal: 12
  },
  handle: {
    fontSize: 15,
    paddingBottom: 3,
    color: Colors.white,
    fontFamily: 'AvenirNext-DemiBold',
    fontWeight: '700'
  },
  bottomBgTxt: {
    color: Colors.white
  },
  raisedSupported: {
    backgroundColor: Colors.wildWatermelon2,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 8,
    minWidth: 120,
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
  },
  optionsIconSkipFont:{
    ...ifIphoneX({
      top: 70,
    }, {
      top: 40,
    }),
    position: 'absolute',
    right: 10,
    height :10,
    width:23,
    zIndex: 1,
  },
listContainer: {
    // width: width,
    position: 'absolute',
    bottom: height * 0.05 + 50,
    left: 10,
    zIndex: 9,
    alignSelf: 'flex-start',
    height: height - 200
}
};

Object.defineProperty(stylesMap.fullScreen, "height", {
  configurable: true,
  enumerable: true,
  get: () => {
    if ( isIphoneX() ) {
      return height - CUSTOM_TAB_Height - getBottomSpace();
    }

    if ( hasNotch() ) {
      return height + statusBarHeight - CUSTOM_TAB_Height;
    }
    return height - CUSTOM_TAB_Height;
  }
})

export default styles = DefaultStyleGenerator.generate(stylesMap);
