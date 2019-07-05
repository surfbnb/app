import { Dimensions  } from 'react-native';

let stylesMap = {
    
    fullScreen: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height
    },
    fullHeight: {
        width: '100%',
        height: Dimensions.get('screen').height
    }

};
  
  export default stylesMap;