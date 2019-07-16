import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import {Dimensions} from "react-native";

let stylesMap = {
  videoWrapperSkipFont:{
    height: Dimensions.get('window').height * .60
  },
  playIconSkipFont :{
    position:'absolute',
    height:25,
    width:25,
    top:Dimensions.get('window').height * 0.65 * 0.50 -12 ,
    left:Dimensions.get('window').width * 0.50 -12
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
