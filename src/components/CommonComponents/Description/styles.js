import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  mainWrapper : {
    padding: 15
  },
  title: {
    fontWeight: '600',
    fontSize: 16
  },
  desc :{
    fontSize: 14
  },
  more: {
    fontWeight: '500'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
