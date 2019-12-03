import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  videoStatsTxt: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'AvenirNext-Regular',
    marginLeft: 2
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
