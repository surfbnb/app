import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { Platform } from 'react-native';
import uploadPic from "../../assets/new-community-upload-icon.png";

const isAndroid = Platform.OS === 'android';
let stylesMap = {
  safeAreaView:{
    flexGrow: 1,
    backgroundColor: Colors.white
  },
  scrollViewContainerStyle:{flexGrow: 1, backgroundColor: Colors.white},
  imageBg:{
    width: '100%',
    aspectRatio: 21/9,
    padding: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: Colors.valhalla
  },
  formWrapper:{paddingHorizontal: 15, paddingBottom: 30},
  tagsWrapper:{
    flexDirection:'row',
    flex:1,
    flexWrap:'wrap',
    marginVertical:10
  },
  linearGradient:{ marginTop: 25, borderRadius: 3 },
  gradientBtnText:{ fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center' },
  imageWrapper:{display: 'flex', alignItems: 'center'},
  communityLabelWrapper:{marginTop:10, marginBottom: 8},
  imgBgTxt: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.wildWatermelon2,
    fontFamily: 'AvenirNext-Medium',
  },
  imgBgSmallTxt: {
    fontSize: 8,
    letterSpacing: -0.5
  },
  uploadPicSkipFont: {
    width: 78,
    height: 62,
    marginBottom: 8
  },
  label:{
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Medium',
    fontWeight:'600',
    fontSize:12
  },
  labelHint: {
    fontSize: 10,
    fontWeight: '300',
    fontFamily: 'AvenirNext-Regular',
    color: 'rgba(42, 41, 59, 0.4);'
  },
  customTextInputBox: {
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderRadius: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    height: 28,
    fontSize: 14,
    marginTop: 0,
    borderBottomWidth:1,
    color:Colors.valhalla,
    borderBottomColor: Colors.seaMist,
    flex:1

  },
  customTextAreaBox:{
    height:120,
  },
  textAreaDynamicCountHeight:{
    height: 120,
  },
  hastagPrefilled:{
    fontSize:14,
    color:'rgba(42, 41, 59, 0.4);',
    flex:0,
    height: 28,
    borderBottomWidth:1,
    borderBottomColor: Colors.seaMist,
    alignSelf:isAndroid?'flex-start':'center',
    textAlignVertical:'center',
    marginBottom:isAndroid?0:12

  },
  dynamicCount:{
    fontSize:12,
    color:'rgba(42, 41, 59, 0.4);'
  },
  dynamicCountWrapper:{
    borderBottomWidth:1,
    borderBottomColor: Colors.seaMist,
    flex:0,
    height:28,
    paddingRight:5
  },
  inputWrapper:{
    flexDirection:'row'
  },
  formInputWrapper:{
    flexDirection:'column',
    flex:1
  },
  tagThumbnail:{
    borderWidth:1,
    borderColor:Colors.wildWatermelon,
    borderRadius:20,
    paddingHorizontal:3,
    margin:3,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    position: "relative"
  },
  displayTag:{
    fontSize:12,
    color:Colors.wildWatermelon,
    fontFamily: 'AvenirNext-Regular',
    fontWeight: 'normal',
    margin:3,
    maxWidth:'85%'
  },
  crosIconBackground:{
    backgroundColor:Colors.wildWatermelon,
    borderRadius:50,
    padding:3,
    padding:2,
    height : 15,
    width:15,
    alignItems:'center',
    justifyContent:'center'
  },
  crosIconBackgroundBtn : {
    position  : "absolute",
    right : 0,
    top: 0,
    width: 50,
    height: "100%",
    zIndex: 10
  },
  crossIconSkipFont:{
    height:10,
    width:10
  },
  errorText: {
    marginTop:5,
    color: Colors.primary,
    fontSize: 11,
    textAlign:'center'
  },
  errorInForminput:{
    fontSize:11,
    marginTop:5,
    marginLeft:5
  },
  noLeftMargin:{
    marginLeft:0
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
