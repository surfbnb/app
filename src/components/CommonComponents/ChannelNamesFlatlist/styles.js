import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  hList: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
