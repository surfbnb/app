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
    width: '20%',
    alignItems: 'center',
    alignSelf: 'flex-end'
  },
  // pepoElemBtn: {
  //   height: 50,
  //   width: 50,
  //   marginBottom: 10,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: 25,
  //   backgroundColor: 'red'
  // elevation: 3
  // },
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
    // ...ifIphoneX(
    //   {
    //     bottom: 0
    //   },
    //   {
    //     bottom: 0
    //   }
    // )
  },
  // bottomExtraSpace: {
  //   backgroundColor: 'rgba(0, 0, 0, 0.6)',
  //   ...ifIphoneX(
  //     {
  //       height: CUSTOM_TAB_Height + getBottomSpace([true])
  //     },
  //     {
  //       height: CUSTOM_TAB_Height,
  //     }
  //   )
  // },
  bottomBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    // maxHeight: 150,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    maxHeight: Dimensions.get('window').height * 0.15,
    minHeight: Dimensions.get('window').height * 0.1
  },
  bottomBgTxt: {
    color: Colors.white
  },
  topContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1
  },
  topBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    paddingVertical: 5,
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.gainsboro,
    borderWidth: 0.5,
    borderRadius: 2,
    minWidth: 60
  },
  topBgTxt: {
    color: Colors.paynesGrey,
    fontSize: 14,
    marginLeft: 5
  },
  topBgPosSkipFont: {
    position: 'absolute',
    left: -9
  },
  // clappedBubble: {
  //   backgroundColor: Colors.wildWatermelon,
  //   height: 50,
  //   width: 50,
  //   position: 'absolute',
  // bottom: 0,
  // right: 0,
  // alignItems: 'center',
  // justifyContent: 'center',
  // borderRadius: 30,
  // zIndex: -1
  // },
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
