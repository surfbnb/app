import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import {getBottomSpace, ifIphoneX} from "react-native-iphone-x-helper";

let stylesMap = {
  container: {
    flex: 1
  },
  previewSkipFont: {
    flex: 1,
    justifyContent: 'space-between'
  },
  captureBtn: {
    alignSelf: 'center'
  },
  imgCaptureButtonSkipFont: {
    height: 76,
    width: 76,
    marginBottom: 20
  },crossIconWrapper:{
    top:10,
    left:0,
    height:60,
    width:60,
  }
  ,
  crossIconSkipFont: {
    ...ifIphoneX({
      marginTop:50,
      marginLeft:20,
    }, {
      marginTop:25,
      marginLeft:20,
    }),
    height:20,
    width:20
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
