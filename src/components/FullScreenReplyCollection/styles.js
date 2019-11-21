import { Dimensions, StatusBar, NativeModules } from 'react-native';
import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { ifIphoneX, getBottomSpace , getStatusBarHeight} from 'react-native-iphone-x-helper';

import  NotchHelper from "../../helpers/NotchHelper";
import { HEADER_HEIGHT } from '../../theme/constants';
const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 20;


let RNDeviceInfo = NativeModules.RNDeviceInfo;
let modalDeviceName = RNDeviceInfo.model === "Redmi Note 7 Pro" && RNDeviceInfo.brand === "xiaomi";
let btmSpace = modalDeviceName ? 5 : 0;

let stylesMap = {
    fullScreen: {
        width: width,
        ...ifIphoneX(
            {
                height: height  - HEADER_HEIGHT - getStatusBarHeight(true)
            },
            {
                height:
                    NotchHelper.hasNotch()
                        ? height + statusBarHeight - btmSpace - HEADER_HEIGHT
                        : height - statusBarHeight - HEADER_HEIGHT
            }
        )
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
    iconWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60
      },
      iconSkipFont: {
        height: 20,
        width: 20
      },
      headerStyles: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        height: HEADER_HEIGHT
      },
      headerText:{
          fontWeight: '600'
      },
      headerSubText:{
          fontSize: 12
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
        alignSelf: 'flex-start',
        height: height - 200
    }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
