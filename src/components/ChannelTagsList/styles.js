import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    height: 50,
    padding: 5, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
