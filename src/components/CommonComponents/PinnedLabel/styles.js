import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {

    wrapper : {
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 9,
        flexDirection: "row",
        borderRadius: 50,
        paddingVertical: 3,
        paddingHorizontal: 7,
        alignItems: 'center',
        backgroundColor: 'rgba(42, 41, 59, 0.25)'
    },

    imageSkipFont: {
        width: 10.4,
        height: 14.4
    },

    text : {
        fontSize: 13,
        marginLeft: 5,
        fontFamily: 'AvenirNext-Medium',
        color: Colors.white
    }
    
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
