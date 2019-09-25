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
    marginBottom: 3
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
    // flexDirection: 'column',
    // justifyContent: 'flex-start',
    borderTopLeftRadius: 20,
    maxHeight: height * 0.3,
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
    paddingHorizontal: 8,
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

export default styles = DefaultStyleGenerator.generate(stylesMap);
