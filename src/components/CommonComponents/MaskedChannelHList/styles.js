import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';

let stylesMap = {

  listPosition: {
    marginTop: 20,
    marginRight: '20%',
    justifyContent: 'center'
  },

  maskedView: {
    flex: 1,
    height: '100%',
    flexDirection: 'row'
  },

  maskedInnerView: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  maskedInnerLinearGradient: {
    flex: 1
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
