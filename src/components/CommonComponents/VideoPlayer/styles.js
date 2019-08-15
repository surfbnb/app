import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import {getBottomSpace, ifIphoneX} from "react-native-iphone-x-helper";


let stylesMap = {
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
