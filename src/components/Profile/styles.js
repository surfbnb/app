import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  balanceHeaderContainer: {
    // flex: 1,
    backgroundColor: Colors.whiteSmoke,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  balanceHeader: {
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: Colors.pinkRed,
    flexDirection: 'row'
  },
  balanceToptext: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '500',
    marginLeft: 8
  },
  pepoBalance: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: '300'
  },
  usdBalance: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500'
  },
  emptyCoverWrapper: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light,
    borderStyle: 'dashed',
    backgroundColor: Colors.white,
    borderRadius: 5,
    alignItems: 'center'
  },
  videoIconBtn: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.light
  },
  creatVideoText: {
    color: Colors.primary
  },
  updateText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.greyLite
  },
  editProfileContainer: {
    height: 75,
    width: 75,
    position: 'relative'
  },
  editProfileIconTouch: {
    height: 40,
    width: 40,
    position: 'absolute',
    right: -15,
    bottom: -7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editProfileIconPos: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.wildWatermelon,
    backgroundColor: Colors.white
  },

  profileEditIconSkipFont: {
    height: 75,
    width: 75,
    borderRadius: 37.5
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
