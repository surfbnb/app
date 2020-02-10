import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from "../../../theme/styles/Colors";
import {fontFamWeight} from "../../../theme/constants";

let stylesMap = {
  mainWrapper : {
    padding: 15
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.valhalla
  },
  desc :{
    fontSize: 14,
    color: Colors.valhalla
  },
  more: {
    color: Colors.valhalla,
    ...fontFamWeight
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
