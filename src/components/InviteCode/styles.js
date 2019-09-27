import { Dimensions } from 'react-native';
import Colors from '../../theme/styles/Colors';
import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";

let stylesMap = {
  parent:{
    flex: 1,
    backgroundColor: 'transparent'
  },
  container: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 25,
    position: 'absolute',
    width: '100%',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    bottom: 0,
    minHeight: Dimensions.get('window').height / 2,
  },
  desc: {
    color: Colors.dark,
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'AvenirNext-Medium'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);