import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import { Dimensions } from 'react-native';
import Colors from '../../theme/styles/Colors';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import {CUSTOM_TAB_Height} from "../../theme/constants";

let stylesMap = {
    fullScreen: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    fullHeightSkipFont: {
        width: '100%',
        height: Dimensions.get('window').height
    },
    touchablesBtns: {
      width: '20%',
      alignItems: 'center',
      alignSelf: 'flex-end'
    },
    pepoElemBtn: {
      backgroundColor: Colors.white,
      height : 50,
      // marginBottom: 5,
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      borderStyle: 'solid',
      borderWidth: 2,
      borderColor: Colors.wildWatermelon
    },
    pepoTxCount:{
        fontSize: 18,
        color: Colors.white,
        alignSelf: 'center',
        marginTop: 3,
      marginBottom: 15
    },
    txElem: {
        marginBottom: 20,
    },
    bottomContainer: {
        width: '100%',
        position: 'absolute',
        ...ifIphoneX({
            bottom: getBottomSpace([true]) + CUSTOM_TAB_Height
        }, {
            bottom: CUSTOM_TAB_Height
        }),
    },
    bottomBg: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        maxHeight: 150,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    bottomBgTxt:{
        color: Colors.white
    },
    topContainer:{
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1
    },
    topBg:{
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
        paddingVertical: 8,
        flexDirection: 'row',
        paddingLeft: 12,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.gainsboro,
        borderWidth: 0.5,
        borderRadius: 2
    },
    topBgTxt:{
        color: Colors.paynesGrey,
        fontSize: 14,
        marginLeft: 5
    },
    topBgPosSkipFont: {
        position: 'absolute',
        left: -9
    },
  clappedBubble: {
    backgroundColor: Colors.wildWatermelon,
    height: 50,
    width: 50,
    position: 'absolute',
    // bottom: 0,
    // right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    zIndex: -1
  },
  btnText: {
    color: Colors.white
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);