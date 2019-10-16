import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  emptyWrapper:{
    margin:15,
    flex:0,
    borderWidth:1,
    borderColor: Colors.light,
    borderStyle: 'dashed',
    borderRadius :5,
    justifyContent:'center',
    alignItems:'center',
    padding: 20,
  },
  msgStyle:{
    color: Colors.greyLite,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
    alignSelf: 'center'
  }

}

export default styles = DefaultStyleGenerator.generate(stylesMap);