import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../theme/styles/Colors';

export default StyleSheet.create({
  backgroundStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    // height: Dimensions.get('screen').height/2,
    position: 'absolute',
    bottom: 0,
    width: '100%'
  }
});
