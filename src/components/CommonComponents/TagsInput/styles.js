import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  suggestionTextWrapper: {
    marginVertical: 9
  },
  suggestionText:{
    fontFamily: 'AvenirNext-Regular',
    color:Colors.midNightblue,
    fontSize:16
  },
  mentionsTitle:{
    fontSize: 15,
    color:Colors.midNightblue,
    fontFamily: 'AvenirNext-Medium',
  },
  mentionSubTitle: {
    fontSize: 14,
    color: Colors.light
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
