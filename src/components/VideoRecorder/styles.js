import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { Dimensions } from 'react-native';

let stylesMap = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.black
  },
  previewSkipFont: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 35
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
    height: 65,
    // padding: 15,
    // paddingHorizontal: 20,
    // marginLeft: -32.5
    //alignSelf: 'center'
    // margin: 20
  },
  flipIconSkipFont: {
    width: 39.5,
    height: 36.5,
    // padding: 15,
    //paddingHorizontal: 20,
    // marginRight: 12,
    // marginTop: 13
    //alignSelf: 'center'
  },
  progressBar: {
    borderRadius: 3.5,
    borderColor: Colors.white,
    borderWidth: 0.5,
    height: 7,
    width: '90%',
    marginLeft: 10,
    marginRight: 10
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
    color: 'white',
    fontWeight: '500'
  },
  smallText: { color: 'white', fontSize: 18, marginTop: 14, fontFamily: 'AvenirNext-Medium' },

  headerText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 24,
    fontFamily: 'AvenirNext-Medium'
  },

  bottomWrapper: {
    flexDirection: 'row',
    // backgroundColor: '#fff',
    // justifyContent: 'space-between',
    // alignSelf: 'flex-end',
    width: Dimensions.get('window').width,
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
