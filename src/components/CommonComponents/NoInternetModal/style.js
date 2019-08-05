import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  noInternetHeader:{
    justifyContent:'center',
    alignItems:'center',
  },
  noInternetContent:{
    alignItems:'center',
    // justifyContent:'center',
    flex:1,
    marginTop:'15%',
    marginHorizontal:30,
  },
  imageDimSkipFont:{
    width:150,
    height:105,
  },
  headerText:{
    marginVertical:20,
    fontSize:17,
    color:Colors.white,
  },
  descText:{
    textAlign:'center',
    color:Colors.darkGray,
    fontSize:17
  },
  refreshBtnText:{
    fontSize : 17,
    color : Colors.white,
  },
  refreshBtn:{
    backgroundColor: 'rgba(96,96,96,0.31)',
    marginTop:'20%',
    width:236,
    height : 40,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:3
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
