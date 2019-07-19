import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';
import {Dimensions} from "react-native";

let stylesMap = {
  videoWrapperSkipFont:{
    height: Dimensions.get('window').height * .60
  },
  playIconSkipFont :{
    position:'absolute',
    height:25,
    width:25,
    top: '50%',
    left: '50%',
    marginLeft:  -12.5,
    marginTop: -12.5
  },
  updateVideo:{
    position:'absolute',
    bottom:0,
    backgroundColor:'rgba(0,0,0,0.75)',
    width:'100%',
    height:50,
    justifyContent:'center',
    alignItems:'center'
  }


};

export default styles = DefaultStyleGenerator.generate(stylesMap);
