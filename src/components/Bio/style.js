import { StyleSheet } from 'react-native';
import Colors from "../../theme/styles/Colors";

export default (styles = StyleSheet.create({
  multilineTextInput:{
    height : 100 ,
    textAlignVertical:'top',
    paddingTop:20
  },
  suggestionText:{
    fontWeight:"normal",
    color:Colors.midnightblue,
    fontSize:18
  },
  suggestionTextWrapper : {
    marginTop:20
  }
}));






