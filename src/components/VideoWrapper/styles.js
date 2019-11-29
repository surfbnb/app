import { Dimensions} from 'react-native';
import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';

const {width, height} = Dimensions.get('window');

let stylesMap = {

  fullHeightWidthSkipFont: {
    width: "100%",
    height: "100%"
  },
  playIconSkipFont: {
    position: 'absolute',
    height: 25,
    width: 25,
    top: height * 0.5 - 12,
    left: width * 0.5 - 12
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
