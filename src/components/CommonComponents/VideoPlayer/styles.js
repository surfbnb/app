import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import {ifIphoneX} from "react-native-iphone-x-helper";
import Colors from '../../../theme/styles/Colors';

let stylesMap = {

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.snow
  },

  imgSizeSkipFont: {
    width: 68.5,
    height: 68.5
  },

  desc:{
    fontSize: 22,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 25,
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Regular'
  },

  historyBackSkipFont:{
    ...ifIphoneX({
      top: 55,
    }, {
      top: 25,
    }),
    width: 29,
    height: 34,
    position: 'absolute',
    left: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
