import Colors from "../../theme/styles/Colors";
import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";

let stylesMap = {
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
  },
  countStyle:{
    fontSize:10,
    textAlign:'right'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);






