import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import {Dimensions} from "react-native";

let stylesMap = {

    backgroundStyle: {
        //backgroundColor: 'rgba(0,0,0,0.80)',
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: Dimensions.get('screen').height,

    },
    headerText: {
        color: 'rgb(239, 85, 102)',
        fontWeight: '500',
        fontSize: 24,
        fontFamily: 'AvenirNext-MediumItalic',
        textAlign: 'center',
        marginBottom: 20
    },
    smallText: {
        color: 'rgb(255, 255, 255)',
        fontSize: 14,
        fontFamily: 'AvenirNext-Regular',
        textAlign: 'center'
    },

    wrappedView: {
        padding: 40,
        backgroundColor: 'rgba(0,0,0,0.80)',
        height:Dimensions.get('screen').height,
        alignItems: 'center',
        justifyContent: 'center'
    },

    headingText: {
        fontWeight: '600',
        fontFamily: 'AvenirNext-Medium'
    },

    horizontalLine: {
        height:1,
        width: '100%',
        backgroundColor: '#fff',
        marginTop: 15,
        marginBottom: 20
    }



};

export default styles = DefaultStyleGenerator.generate(stylesMap);
