import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import { Platform } from 'react-native';

let stylesMap = {
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  captureBtn: {
    alignSelf: 'center'
  },
  imgCaptureButtonSkipFont: {
    height: 76,
    width: 76,
    marginBottom: 20
  },
  crossIconWrapper: {
    position: 'absolute',
    top: 10,
    left: 0,
    height: 60,
    width: 60,
    zIndex:9
  },
  crossIconSkipFont: {
    marginTop: Platform.OS == 'android' ? 20 : 0,
    marginLeft: 20,
    height: 20,
    width: 20
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
