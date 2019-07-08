import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import { Dimensions } from 'react-native';
import Colors from '../../theme/styles/Colors';

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
        alignSelf: 'flex-end', marginBottom: 15, marginRight: 20
    },
    pepoTxCount:{
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
        marginTop: 5
    },
    txElem: {
        marginBottom: 20,
        alignSelf: 'flex-end',
        marginRight: 20,
    },
    bottomContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 50
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
        color: 'white'
    },
    topContainer:{
        position: 'absolute',
        top: 50,
        right: 20
    },
    topBg:{
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
        paddingVertical: 6,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#e0e0e0',
        borderWidth: 0.5,
        borderRadius: 1
    },
    topBgTxt:{
        color: '#3e404b',
        fontSize: 14
    },
    topBgPosSkipFont: {
        position: 'absolute',
        left: -9
    }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);