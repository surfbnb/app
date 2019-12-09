import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';
import { CUSTOM_TAB_Height } from "../../../theme/constants";
import {ifIphoneX} from "react-native-iphone-x-helper";

let stylesMap = {
    wrapper : {
      width:'100%',
      ...ifIphoneX(
        {
          height: 88
        },
        {
          height: CUSTOM_TAB_Height
        }),
      zIndex:9999,
      backgroundColor:Colors.wildWatermelon2
    },
    innerWrapper: {
      width: '100%',
      height: CUSTOM_TAB_Height,
      flexDirection:'row',
      alignItems: 'center',
      paddingHorizontal:12,
      borderTopWidth: 0.5,
      borderColor: 'rgba(151, 151, 151, 0.6)'
    },
    text: {
        color: Colors.white,
        marginLeft: 10,
        fontFamily: 'AvenirNext-Medium'
    },
    replyIconSkipFont : {
        height:10,
        width:15
    }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
