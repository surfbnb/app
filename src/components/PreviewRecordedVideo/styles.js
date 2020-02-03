import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { Dimensions, StatusBar } from 'react-native';

let stylesMap = {
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  previewVideoSkipFont: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  progressBar: {
    position: 'absolute',
    top: 40,
    borderRadius: 3.5,
    borderColor: Colors.white,
    borderWidth: 0.5,
    height: 7,
    width: '90%',
    alignSelf: 'center'
  },
  cancelButton: {
    position: 'absolute',
    top: 55,
    height: 50,
    width: 50,
    marginLeft: 20
  },
  cancelText: {
    color: Colors.white,
    fontWeight: 'bold'
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    zIndex: 2,
    flexDirection: 'row'
  },
  playIconSkipFont: {
    width: 65,
    height: 65
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
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
