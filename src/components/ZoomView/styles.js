import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import {fontFamWeight} from "../../theme/constants";

let stylesMap = {
  zoomContainer: {
    width:'100%',
    height:'100%',
    backgroundColor:'transparent',
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
      flex:1,
      overflow: 'visible',
      backgroundColor: 'transparent'
  },
  imageZoom: {
      overflow: 'visible',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
  }
  }

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
