import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  suggestionText: {
    fontWeight: 'normal',
    color: Colors.midNightblue,
    fontSize: 18
  },
  suggestionTextWrapper: {
    marginTop: 20
  },
  multilineTextInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 20
  },
  countStyle: {
    fontSize: 10,
    textAlign: 'right'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
