import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import { Dimensions } from 'react-native';
import {getBottomSpace, ifIphoneX} from "react-native-iphone-x-helper";


let stylesMap = {
  closeIconSkipFont:{
    position:'absolute',
    ...ifIphoneX({
      top:50,
      left:20,
    }, {
      top:25,
      left:20,
    }),
    height:20,
    width:20
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
