import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { Dimensions } from 'react-native';

let stylesMap = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.black
  },
  cameraViewSkipFont: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom:15
  },
  capture: {
    flex: 0,
    backgroundColor: '#ff3b30',
    width: 100,
    height: 100,
    borderRadius: 40,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
    borderWidth: 3,
    borderColor: Colors.white
  },
  captureButtonSkipFont: {
    width: 65,
    height: 65
  },
  outerCircle: {
    width: 65,
    height: 65,
    borderWidth: 5,
    borderRadius: 65/2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: 'rgb(255, 85, 102)'
  },
  innerCircle: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
    borderRadius: 50/2,
    backgroundColor: Colors.wildWatermelon,
  },
  squareIcon: {
    width: 28,
    height: 28,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -14,
    marginLeft: -14,
    borderRadius: 5,
    backgroundColor: Colors.wildWatermelon,
  },
  flipIconSkipFont: {
    width: 39.5,
    height: 36.5
  },
  progressBar: {
    borderRadius: 3.5,
    borderColor: Colors.white,
    borderWidth: 1,
    height: 7
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
  closeBtWrapper: {
    position: 'absolute',
    zIndex: 2,
    top: 45,
    left: 10,
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeIconSkipFont: {
    height: 27,
    width: 27
  },

  backgroundStyle: {
    backgroundColor: 'rgba(0,0,0,0.80)',
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: Dimensions.get('screen').height,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingMessage: {
    fontSize: 18,
    marginBottom: 15,
    color: Colors.white,
    fontWeight: '500'
  },
  smallText: {
    color: Colors.white,
    fontSize: 18,
    marginTop: 14,
    fontFamily: 'AvenirNext-Medium'
  },

  miniText: {
    color: Colors.white,
    fontSize: 16,
    letterSpacing: 0.5,
    marginTop: 14,
    fontFamily: 'AvenirNext-Medium'
  },

  headerText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 24,
    fontFamily: 'AvenirNext-Medium'
  },

  bottomWrapper: {
    flexDirection: 'row',
    marginBottom: 30
    // width: Dimensions.get('window').width
  },

  triangleRight: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderBottomWidth: 22,
    borderTopWidth: 22,
    borderLeftWidth: 16,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderLeftColor: Colors.wildWatermelon2
  },

  tooltipStyle: {
    letterSpacing: 1,
    fontFamily:'AvenirNext-DemiBold',
    shadowColor:'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2
  },

  tooltipWrapper: {
    backgroundColor: '#eee',
    marginBottom: 10,
    position: 'relative',
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent:'center',
    borderRadius: 4,
    // maxWidth: 150,
    minWidth: 120,
    alignSelf: 'center'
  },
  tooltipLowerTriangle : {
    height:12,
    width:12,
    top: '100%',
    marginTop: 2,
    backgroundColor: '#eee',
    alignSelf:'center',
    position: 'absolute',
    transform: [{ rotate: '45deg'}]
  },
  backIconSkipFont: {
    height: 19.55,
    width: 28.8
  },

  separationBarsStyle: {
    backgroundColor: '#fff',
    width: 2,
    height: 7,
    position: 'absolute'
  },
  videolengthContainer:{
    flexDirection:'row',
    position:'absolute',
    left:'50%',
    color:"#ffffff",
    bottom:0,
    marginLeft:-25 ,// width/2
    marginBottom:10
  },
  videolengthItems :{
    marginRight:40,
    width:50,
  },
  secondsAnimatedComponent:{
    position:'absolute',
    width:70,
    top:'30%',
    left:'50%',
    marginLeft : -35 // - width/2

  },
  secondsAnimatedText:{
    color: Colors.black,    //TODO: SHRADDHA [color = black for testing, change it to white]
    fontSize:60
  },
  videolengthItemText:{
    color:Colors.black        //TODO: SHRADDHA [color = black for testing, change it to white]
  }




};

export default styles = DefaultStyleGenerator.generate(stylesMap);
