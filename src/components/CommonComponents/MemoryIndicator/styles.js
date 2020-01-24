import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';

import {ifIphoneX} from "react-native-iphone-x-helper";

let stylesMap = {
    wrapper : {
        marginBottom: 20, 
        height: 40, 
        width: 40, 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 20,
        zIndex: 10,
        position: "absolute",
        right: 10,
        ...ifIphoneX({
            top: 110,
          }, {
            top: 80,
          }),
    }
}

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
