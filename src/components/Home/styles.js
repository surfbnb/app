import { Dimensions, StatusBar, NativeModules } from 'react-native';
import { isIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';

import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { CUSTOM_TAB_Height } from '../../theme/constants';
import {hasNotch} from "../../helpers/NotchHelper";

const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;

let stylesMap = {
  fullScreen: {
    width: width
  },
  fullHeightWidthSkipFont: {
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
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    fontFamily: 'AvenirNext-DemiBold'
  },
  txElem: {
    marginBottom: 20
  },
  bottomContainer: {
    width: width,
    position: 'absolute',
    bottom: 0
  },
    listContainer: {
      // width: width,
      position: 'absolute',
      bottom: height * 0.05 + 50,
      left: 10,
      zIndex: 9,
      // alignSelf: 'flex-start',
      //height: height - 200
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
  parent:{
    flex: 1,
    backgroundColor: 'transparent'
  },
  popupContainer: {
    backgroundColor: Colors.white,
    padding : 20,
    position: 'absolute',
    width: '100%',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    bottom: 0,
  },
    crossIconWrapper: {
      position: 'absolute',
      left: 10,
      top : 10,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center'
    },
    crossIconSkipFont: {
      width: 13,
      height: 12.6
    },
    contentWrapper:{
      flex:1,
      justifyContent : 'center' ,
      alignItems : 'center',
      marginTop : 20,
      paddingBottom : 25
  },
    imageDimensionSkipFont :{
      height : 50,
      width : 50,
      marginBottom : 15,
    },
  headerText : {
    fontSize : 18,
    marginBottom : 11,
    fontFamily: 'AvenirNext-Regular',
    color : Colors.dark
  },
  desc : {
    color : Colors.dark,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'AvenirNext-Medium',
    paddingBottom : 15
  }
}

;

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
