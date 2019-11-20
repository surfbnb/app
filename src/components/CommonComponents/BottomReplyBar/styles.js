import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';
import { CUSTOM_TAB_Height } from "../../../theme/constants";

let stylesMap = {
    wrapper : {
        flex: 1, 
        height: CUSTOM_TAB_Height, 
        backgroundColor: Colors.black,
        paddingHorizontal: 10
    },
    text: {
        color: Colors.white
    },
    replyIcon : {
        height:10,
        width:15
    }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
