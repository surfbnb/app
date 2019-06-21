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
    flexDirection: 'row'
  },
  userInfo: {
    flexDirection: 'row',
    marginLeft: 10
  },
  figure: {
    backgroundColor: Colors.whiteSmoke,
    borderRadius: 25,
    paddingVertical: 4,
    minWidth: 50,
    alignSelf: 'flex-start',
    color: Colors.dark,
    paddingHorizontal:5
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
  },
  emptyFeed: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.whiteSmoke
  },
  emptyFeedIconSkipFont: {
    width: 81,
    height: 51,
    marginBottom: 20
  },
  emptyFeedText: {
    fontSize: 15,
    color: Colors.dark
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
