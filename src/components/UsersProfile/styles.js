import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import {Dimensions} from "react-native";

let stylesMap = {
  videoWrapperSkipFont:{
    height: Dimensions.get('window').height * .60
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
