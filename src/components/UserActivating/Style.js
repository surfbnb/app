import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50
  },
  descTxt: {
    color: Colors.valhalla,
    fontSize: 16
  },
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
