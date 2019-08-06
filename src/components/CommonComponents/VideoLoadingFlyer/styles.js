import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  container: {
    flexDirection: 'row',
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
