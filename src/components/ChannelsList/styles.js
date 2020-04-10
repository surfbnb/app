import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {

    searchInAllBtn : {
        alignSelf: "center"
    },

    searchInAllText : {
        color: Colors.pinkRed, 
        fontFamily: 'AvenirNext-DemiBold',
        fontSize: 16
    }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
