import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  emptyWrapper:{
    marginHorizontal:15,
    marginTop: 15,
    flex:0,
    justifyContent:'center',
    alignItems:'center',
    padding: 20,
  },
  msgStyle:{
    color: Colors.greyLite,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
    alignSelf: 'center',
    marginTop: 20
  },
  imgSizeSkipFont: {
    width:50,
    height:50
  }

}

export default styles = DefaultStyleGenerator.generate(stylesMap);