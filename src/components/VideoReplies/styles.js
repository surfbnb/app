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
    iconWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60
      },
      crossIconSkipFont: {
        height: 20,
        width: 20
      },
      videoStatsContainer: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
      },
      deleteButton: {
        height: 24,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
      },
      videoStatsTxt: {
        color: Colors.white,
        fontSize: 16,
        fontFamily: 'AvenirNext-Regular',
        marginLeft: 2
      },
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
      fullHeightWidth: {
        width: "100%",
        height: "100%"
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
      }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);