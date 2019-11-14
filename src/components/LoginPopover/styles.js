import { Dimensions } from 'react-native';
import Colors from '../../theme/styles/Colors';
import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";

let stylesMap = {
  parent: {
    flex: 1
  },
  container: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Dimensions.get('window').height / 2.3,
    paddingTop: 50,
    paddingBottom: 40,
    position: 'absolute',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    // ...ifIphoneX(
    //   {
    //     bottom: getBottomSpace([true])
    //   },
    //   {
    //     bottom: 0
    //   }
    // )
    bottom: 0
  },
  crossBtnPos: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  desc: {
    color: Colors.dark,
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    width: '85%'
  },
  tocPp: {
    width: '85%',
    marginTop: 10
  },
  termsTextBlack: {
    lineHeight: 24,
    color: Colors.dark
  },
  termsTextBlue: {
    lineHeight: 24,
    color: Colors.softBlue
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);