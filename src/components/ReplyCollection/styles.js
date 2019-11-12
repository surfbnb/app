import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  deleteButton: {
    height: 24,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
