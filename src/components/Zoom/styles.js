import Colors from "../../theme/styles/Colors";
import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";

let stylesMap = {
  textInput : {height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: Colors.white,
    padding: 10
  },
  primaryActionButton: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor:Colors.primary,
    borderRadius:10,
    borderWidth: 1,
    borderColor: Colors.white
  },
  primaryActionText: {
    color:Colors.white,
    textAlign:'center',
    fontWeight: "bold",
    fontSize: 16
  },
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
