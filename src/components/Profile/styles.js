import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  balanceHeaderContainer: {
    // flex: 1,
    backgroundColor: Colors.whiteSmoke,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  balanceHeader: {
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center'
  },
  balanceToptext: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '500'
  },
  pepoBalance: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: '800'
  },
  usdBalance: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500'
  },
  emptyCoverWrapper:{
    marginTop:20,
    padding:20,
    borderWidth:1,
    borderColor: Colors.light,
    borderStyle: 'dashed',
    backgroundColor: Colors.white,
    borderRadius:5,
    alignItems:'center'

  },
  videoIconBtn:{
    marginVertical:10,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:25,
    width:50,
    height:50,
    borderWidth:1,
    borderColor:Colors.light
    },
  creatVideoText:{
    color:Colors.primary
  },
  updateText:{
    textAlign:'center',
    fontWeight:'bold',
    color:Colors.greyLite
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
