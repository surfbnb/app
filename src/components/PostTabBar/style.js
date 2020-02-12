import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  videoStatsContainer: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  deleteButton: {
    height: 24,
    width: 40,
    justifyContent: 'center',
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
