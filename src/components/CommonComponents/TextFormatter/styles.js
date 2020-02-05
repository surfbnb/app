import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import {fontFamWeight} from "../../../theme/constants";

let stylesMap = {
  iosDroidFamWeight : {
    ...fontFamWeight
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
