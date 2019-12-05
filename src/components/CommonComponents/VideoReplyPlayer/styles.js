import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import {ifIphoneX} from "react-native-iphone-x-helper";
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  
  loadingContainer:{
     width: "100%", 
     flex: 1 , 
     alignItems: "center", 
     justifyContent:"center",
     height:"100%", 
     backgroundColor:"#000"
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
