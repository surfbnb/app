import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  pepoBalance: {
    fontSize: 18,
    color: '#ff5566',
    fontFamily: 'AvenirNext-DemiBold'
  },
  usdBalance: {
    fontSize: 14,
    color: '#ff5566'
  },
  redeemBalance: {
    fontSize: 12,
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Regular'
  },
  updates: {
    textAlign: 'center',
    borderColor: 'rgb(218, 223, 220)',
    borderWidth: 1,
    color: '#2a293b',
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    paddingVertical: 10,
    marginTop: 30
  },
  editProfileContainer: {
    height: 75,
    width: 75,
    position: 'relative',
    marginBottom: 20
  },
  editProfileIconTouch: {
    height: 50,
    width: 50,
    position: 'absolute',
    right: -15,
    bottom: -13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editProfileIconPos: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.wildWatermelon,
    backgroundColor: Colors.white
  },

  profileEditIconSkipFont: {
    height: 75,
    width: 75,
    borderRadius: 37.5
  },
  accessText:{
    fontSize:18,
    color:Colors.azureBlue
  },
  accessTextDesc:{
    fontSize:15,
    textAlign:'center',
    fontWeight:'500',
    marginVertical:20
  },
  imageDimSkipFont:{
    height:40,
    width:50
  },
  accessAllowContent:{
    alignItems:'center',
    flex:1,
    marginTop:'25%',
    marginHorizontal:30
  },
  crossIconDimSkipFont:{
    height:10,
    width:10
  },
  crossIconWrapper:{
    position:'absolute',
    top:0,
    left:0,
    padding:20
  },
  allowAccessheader:{
    justifyContent:'center',
    alignItems:'center',
    borderBottomColor:Colors.lightGrey,
    borderBottomWidth:1,
    flexDirection:'row',
    width:'100%',
    height:50
  },
  headerText:{
    fontSize:15,
    textAlign:'center',
    fontWeight:'500',
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
