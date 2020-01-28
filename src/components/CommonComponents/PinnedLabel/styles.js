import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {

    wrapper : {
        poistion: "absolute",
        top: 10,
        right: 10,
        backgroundColor : Colors.black
    },

    image: {
        width: 20,
        height: 20
    },

    text : {
        fontSize: 14
    }
    
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
