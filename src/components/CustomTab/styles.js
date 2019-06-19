import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    flex: 0,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    elevation: 8
  },
  tabElementSkipFont: {
    alignSelf: 'center',
    marginBottom: 3,
    height: 23,
    width: 23
  },
  tabElementFriendsSkipFont: {
    alignSelf: 'center',
    marginBottom: 3,
    height: 22,
    width: 35
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
