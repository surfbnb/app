import { StyleSheet } from "react-native";
import Colors from "../../theme/styles/Colors";
export default styles = StyleSheet.create({
  emptyListConatiner: {
    borderWidth: 1,
    borderColor: Colors.light,
    borderStyle: 'dashed',
    backgroundColor: Colors.white,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent:'center',
    height:70,
    paddingHorizontal:20,
    paddingVertical:50,


  },
  emptyListConatinerText:{
    color:Colors.greyLite,
    fontWeight:"500",
    textAlign:'center',
    fontSize:12
  }
});