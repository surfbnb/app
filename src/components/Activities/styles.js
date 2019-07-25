import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  link: {
    color: 'rgb(22,141,193)',
    fontSize: 20
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
