import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { getBottomSpace, ifIphoneX } from 'react-native-iphone-x-helper';

let stylesMap = {
  container: {
    flex: 1
  },
  header: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: Colors.white,
    borderRadius: 7,
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 20,
    textAlign: 'center'
  },
  txtWrapper: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleName: {
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Medium',
    fontSize: 16
  },
  titleHandle: {
    color: 'rgba(42, 41, 59, 0.6);',
    fontFamily: 'AvenirNext-Medium',
    fontSize: 15
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 25
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
