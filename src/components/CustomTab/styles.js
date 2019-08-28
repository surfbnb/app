import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { CUSTOM_TAB_Height } from '../../theme/constants';

let stylesMap = {
  container: {
    flex: 0,
    width: '100%',
    height: CUSTOM_TAB_Height,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    // elevation: 1,
    alignItems: 'center',
    // borderColor: 'rgba(0, 0, 0, 0.25)',
    // borderWidth: 1,
    // borderBottomWidth: 0,
    // elevation: 8
  },
  tabElementSkipFont: {
    alignSelf: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    height: 35,
    width: 35
  },
  // tabElementFriendsSkipFont: {
  //   alignSelf: 'center',
  //   marginHorizontal: 20,
  //   marginVertical: 10,
  //   height: 22,
  //   width: 35
  // }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
