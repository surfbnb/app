import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import { Dimensions } from 'react-native';
import Colors from '../../theme/styles/Colors';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import {CUSTOM_TAB_Height} from "../../theme/constants";

let stylesMap = {
    fullScreen: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height
    },
    fullHeightSkipFont: {
        width: '100%',
        height: Dimensions.get('screen').height
    },
    pepoElem: {
        alignSelf: 'flex-end',
        marginBottom: 15,
        marginRight: 20
    },
    pepoTxCount:{
        fontSize: 18,
        color: Colors.white,
        alignSelf: 'center',
        marginTop: 5
    },
    txElem: {
        marginBottom: 20,
        alignSelf: 'flex-end',
        marginRight: 20
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
    }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);