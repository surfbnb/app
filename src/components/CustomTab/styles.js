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
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
    alignItems: 'center'
  },
  tapArea:{
    minHeight: 55,
    justifyContent: "center"
  },
  tabElementSkipFont: {
    alignSelf: 'center',
    marginHorizontal: 20,
    height: 35,
    width: 35
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
