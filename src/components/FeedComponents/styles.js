import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: Colors.whiteSmoke
  },
  cellWrapper: {
    borderWidth: 0.2,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    borderRadius: 6,
    padding: 15
  },
  profileImgSkipFont: {
    borderRadius: 20,
    height: 40,
    width: 40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
  figure: {
    backgroundColor: Colors.whiteSmoke,
    borderRadius: 25,
    paddingVertical: 4,
    width: 50,
    fontSize: 12,
    color: Colors.dark
  },
  userNameText: {
    marginBottom: 2,
    fontSize: 14,
    color: Colors.dark,
    paddingRight: 8,
    fontWeight: '500'
  },
  timeStamp: {
    color: Colors.light,
    fontSize: 12
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
