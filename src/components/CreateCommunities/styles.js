import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { Platform } from 'react-native';
import uploadPic from "../../assets/new-community-upload-icon.png";

let stylesMap = {
  imageBg:{
    width: '100%',
    aspectRatio: 21/9,
    padding: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: Colors.valhalla
  },
  imgBgTxt: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.wildWatermelon2,
    fontFamily: 'AvenirNext-Medium',
  },
  imgBgSmallTxt: {
    fontSize: 8,
    letterSpacing: -0.5
  },
  uploadPic: {
    width: 78,
    height: 62,
    marginBottom: 8,
    textAlign: 'center'
  },
  label:{
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Medium'
  },
  labelHint: {
    fontSize: 10,
    fontWeight: '300',
    color: 'rgba(42, 41, 59, 0.4);'
  },
  customTextInputBox: {
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderRadius: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    height: 28,
    fontSize: 12,
    marginTop: 0,
    borderBottomColor: Colors.seaMist
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
