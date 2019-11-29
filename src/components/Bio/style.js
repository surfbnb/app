import Colors from "../../theme/styles/Colors";
import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";

let stylesMap = {
  multilineTextInput:{
    height : 100 ,
    textAlignVertical:'top',
    padding: 15,
    paddingTop: 15,
    marginTop: 0
  },
  dropDownStyle: {
    position: 'absolute',
    top: 99,
    width: '100%',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 1
  },
  countStyle:{
    fontSize:10,
    marginTop: 5,
    textAlign:'right'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);






