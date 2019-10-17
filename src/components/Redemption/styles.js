import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {

  outerContainer : { 
    flex: 1, 
    backgroundColor: 'transparent' 
  },
    
  container: {
      backgroundColor: Colors.white,
      alignSelf: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      position: 'absolute',
      width: '100%',
      borderTopRightRadius: 25,
      borderTopLeftRadius: 25,
      bottom: 0
    },

    viewWrapper: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop: 10,
      alignItems: "center"
    },

    topWrapper :{
      paddingHorizontal: 20,
      alignItems: "center"
    },

    successViewWrapper : {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 30,
      paddingHorizontal: 20
    },

    appUpdateWrapper : {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 40
    },

    successText : {
      textAlign: 'center',
      fontSize: 16 , 
      marginBottom: 20,
      marginHorizontal: 30
    },

    redemtionWrapper :{ 
      alignItems: "center"
    },

    heading :{ 
      fontSize: 18,
      fontWeight: "500",
      paddingBottom: 10,
      color: Colors.black
    },

    subText1 : {
      textAlign: "center",
      color: Colors.black,
      paddingBottom: 10,
      fontSize: 14
    },

    subSection : {
      width: '100%'
    },

    heading2 : {
      textAlign: "center",
      fontSize: 14,
      fontWeight: "500",
      color: Colors.black,
      marginBottom: 5
    },

    valueIn:{
      backgroundColor: Colors.whisper,
      paddingVertical: 3,
      alignItems: 'center',
      marginBottom: 5,
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 3
    },

    btnStyle : {
      fontSize: 16,
      textAlign: 'center' 
    },

    balanceText : {
      textAlign: "center",
      alignItems: 'center',
      color: Colors.black,
      marginTop: 15
    },

    valueInText : {
      color: Colors.valhalla,
      fontSize: 12
    },

    formInputWrapper : {
      position: 'relative'
    },

    formInputText : {
      paddingLeft: 34,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderColor: Colors.seaMist
    },

    textInputImageSkipFont : {
      position:'absolute', 
      height: 23, 
      width: 23, 
      left: 8, 
      top: 17
    },

    crossIconWrapper: {
      position: 'absolute',
      left: 5,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    },

    crossIconSkipFont: { 
      width: 13, 
      height: 12.6 
    },

    loadingWrapper :{
      margin: 60,
      paddingHorizontal: 30
    },

    animationImageSkipFont : {
      width: 40, 
      height: 40, 
      marginBottom: 20
    },

    loadingText : {
      textAlign:'center'
    },

    errorImageSkipFont : {
      width: 30, 
      height: 30, 
      marginBottom: 20
    },

    errorMessage : {
      textAlign: "center"
    },

    appUpdateImageSkipFont : { 
      height: 100, 
      aspectRatio: 220/368, 
      marginBottom: 20 
    },

    appUpdateText : {
      marginBottom: 20,  
      textAlign: 'center'
    },

    successImageSkipFont : { 
      width: 164.6, 
      height: 160, 
      marginBottom: 20 
    },

    pepcornImageSkipFont : { 
      width: 85, 
      height: 85, 
      marginBottom: 10
    },

    pepoIconSkipFont : { 
      width: 10, 
      height: 10
    },

    pepoErrorText : { 
      textAlign: 'center', 
      marginBottom: 10 
    },

    balanceTextImageSkipFont : { 
      width: 12, 
      height: 12 ,
      alignSelf: 'center'
    },

    successLink :{
      marginTop: 20,
      color: Colors.wildWatermelon2
    }
 
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
