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
    borderBottomWidth: 0,
    elevation: 8
  },
  tabElementSkipFont: {
    alignSelf: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    height: 23,
    width: 23,
    // padding: 30
  },
  tabElementFriendsSkipFont: {
    alignSelf: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    height: 22,
    width: 35,
    // padding: 30
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
