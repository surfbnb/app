import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import { Dimensions } from 'react-native';
import {getBottomSpace, ifIphoneX} from "react-native-iphone-x-helper";


let stylesMap = {
  closeIconSkipFont:{
    ...ifIphoneX({
      marginTop:50,
      marginLeft:20,
    }, {
      marginTop:25,
      marginLeft:20,
    }),
    height:20,
    width:20
  },
  closeBtWrapper:{
    position:'absolute',
    top:10,
    left:0,
    height:60,
    width:60,

  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
