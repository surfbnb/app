import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {

    wrapper : {
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 9,
        flexDirection: "row"
    },

    imageSkipFont: {
        width: 20,
        height: 20
    },

    text : {
        fontSize: 14
    }
    
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
