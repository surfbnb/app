import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../theme/styles/Colors';

let stylesMap = {
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: Colors.black
    },
    previewSkipFont: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 35
    },
    capture: {
      flex: 0,
      backgroundColor: "#ff3b30",
      width: 100,
      height: 100,
      borderRadius: 40,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: "center",
      margin: 20,
      borderWidth: 3,
      borderColor: Colors.white
    },
    captureButtonSkipFont: {
      width: 65,
      height: 65,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: "center",
      // margin: 20
    },
    progressBar: {
      borderRadius: 3.5,
      borderColor: Colors.white,
      borderWidth: 0.5,
      height: 7,
      width: '90%',
      marginLeft: 10,
      marginRight: 10
    },
    cancelButton: {
      position: 'absolute',
      top: 55,
      height: 50,
      width: 50,
      left: 20
    },
    cancelText: {
      color: Colors.white,
      fontWeight: 'bold'
    },
    closeBtWrapper:{
      position:'absolute',
      top:10,
      left:0,
      height:60,
      width:60
    },
    closeIconSkipFont:{
      marginTop:40,
      marginLeft:20,
      height:20,
      width:20
    },

};

export default styles = DefaultStyleGenerator.generate(stylesMap);