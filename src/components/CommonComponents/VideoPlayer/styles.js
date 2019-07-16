import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import { Dimensions } from 'react-native';


let stylesMap = {
  closeIconSkipFont:{
    position:'absolute',
    top:20,
    left:20,
    height:20,
    width:20
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
