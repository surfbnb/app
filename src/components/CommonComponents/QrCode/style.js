import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  modalContainer:{
    flex:1,
    padding : 10,
    backgroundColor : 'rgba(255,255,255,0.87)'
  },
  crossIconSkipFont : {
    height : 15,
    width : 15
  },
  modalContentWrapper:{
    flex:1,
    alignItems: 'center',
    justifyContent : 'center',
  },
  modalTextStyle:{
    fontSize: 14,
    fontFamily: 'AvenirNext-Medium',
    color:Colors.dark,
    textAlign:'center'
  },
  qrCode:{
    borderRadius : 20,
    padding:20,
    backgroundColor:Colors.wildWatermelon2,
    overflow:"hidden",
    marginBottom : 10
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);