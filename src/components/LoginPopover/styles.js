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
    minHeight: Dimensions.get('window').height / 2,
    paddingTop: 40,
    paddingBottom: 30,
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 20,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
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
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'AvenirNext-Medium'
  },
  twtBtn:{
    marginTop: 30,
    flexDirection: 'row',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  tos:{
    textAlign: 'center',
    lineHeight: 20,
    color: 'rgba(72, 72, 72, 0.8)'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);