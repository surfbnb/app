import { Dimensions, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import { CUSTOM_TAB_Height } from '../../theme/constants';

let stylesMap = {
  fullScreen: {
    width: Dimensions.get('window').width,
    ...ifIphoneX(
      {
        height: Dimensions.get('window').height - CUSTOM_TAB_Height - getBottomSpace([true])
      },
      {
        height: DeviceInfo.hasNotch()
          ? Dimensions.get('window').height - CUSTOM_TAB_Height + StatusBar.currentHeight
          : Dimensions.get('window').height - CUSTOM_TAB_Height
        // height: Dimensions.get('window').height - CUSTOM_TAB_Height
      }
    )
  },
  fullHeightSkipFont: {
    width: '100%',
    height: '100%'
  },
  touchablesBtns: {
    alignSelf: 'flex-end',
    marginBottom: -30,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Dimensions.get('window').height * 0.15,
    minHeight: Dimensions.get('window').height * 0.1
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
    backgroundColor: '#ff5566',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 5,
    width: 130,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  raisedSupportedTxt: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'AvenirNext-DemiBold'
  },
  topContainer: {
    position: 'absolute',
    top: 50,
    right: 0,
    zIndex: 1
  },
  topBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    minWidth: 60
  },
  topBgTxt: {
    color: '#ff5566',
    fontSize: 14,
    marginLeft: 6,
    fontFamily: 'AvenirNext-DemiBold'
  },
  topBgPosSkipFont: {
    position: 'absolute',
    left: -9
  },
  btnText: {
    color: Colors.white
  },
  playIconSkipFont: {
    position: 'absolute',
    height: 25,
    width: 25,
    top: Dimensions.get('window').height * 0.5 - 12,
    left: Dimensions.get('window').width * 0.5 - 12
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);