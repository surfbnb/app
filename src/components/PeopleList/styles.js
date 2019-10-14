import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  item: {
    fontSize: 15,
    flex: 1,
    fontFamily: 'AvenirNext-Medium',
    color: Colors.valhalla,
    marginLeft: 10
  },
  txtWrapper: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
