import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  videoStatsContainer: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  videoStatsTxt: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    marginLeft: 2
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
