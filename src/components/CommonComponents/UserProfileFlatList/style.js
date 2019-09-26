import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  videoStatsContainer: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  deleteButton: {
    // padding: 10,
    backgroundColor: 'blue',
    height: 6,
    width: 28,
    justifyContent: 'center',
    alignItems: 'flex-end'
    // top:0,
    // right: 4
    //flexDirection: 'row',
    //alignItems: 'center',
    //width: '100%'
  },
  videoStatsTxt: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    marginLeft: 2
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
