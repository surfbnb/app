import { Dimensions, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import { CUSTOM_TAB_Height } from '../../theme/constants';
import historyBack from "../../assets/user-video-history-back-icon.png";

let stylesMap = {
  fullScreen: {
    width: Dimensions.get('window').width,
    ...ifIphoneX(
      {
        height: Dimensions.get('window').height - CUSTOM_TAB_Height - getBottomSpace([true])
      },
      {
        height: (DeviceInfo.hasNotch() || StatusBar.currentHeight > 24)
          ? Dimensions.get('window').height - CUSTOM_TAB_Height + StatusBar.currentHeight
          : Dimensions.get('window').height - CUSTOM_TAB_Height
      }
    )
  },
  fullHeightSkipFont: {
    width: '100%',
    height: '100%'
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
    maxHeight: Dimensions.get('window').height * 0.20,
    minHeight: Dimensions.get('window').height * 0.05
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
    top: Dimensions.get('window').height * 0.5 - 12,
    left: Dimensions.get('window').width * 0.5 - 12
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
