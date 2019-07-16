import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  balanceHeaderContainer: {
    flex: 1,
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
  infoHeaderWrapper:{
    flexDirection:'row',
    justifyContent:'center',
    marginVertical:10
  },
  profileImageSkipFont:{
    height:25,
    width:25
  },
  userName: {
    fontWeight: 'bold',
    color: Colors.dark,
    marginLeft: 5
  },
  bioSection:{
    textAlign:'center',
    marginVertical:10
  },
  numericInfoWrapper:{
    flexDirection:'row',
    flex:1,
    justifyContent:'center',
    marginVertical:15
  },
  numericInfo:{
    color:Colors.dark,
    fontWeight:'bold',
    textAlign:'center'
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
