import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  txtWrapper: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleName: {
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Medium',
    fontSize: 16
  },
  titleHandle: {
    color: 'rgba(42, 41, 59, 0.6);',
    fontFamily: 'AvenirNext-Medium',
    fontSize: 15
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
