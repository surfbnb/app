import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import Colors from '../../theme/styles/Colors';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'

export default StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...ifIphoneX({
      height: Dimensions.get('window').height / 2,
    }, {
      height: PixelRatio.get() === 2 ? Dimensions.get('window').height * 0.75 : Dimensions.get('window').height / 2
    }),
    // height: Dimensions.get('window').height * 0.75,
    position: 'absolute',
    width: '100%',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    ...ifIphoneX({
      bottom: getBottomSpace([true])
    }, {
      bottom: 0
    }),
  },
  parent:{
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  desc: {
    color: Colors.dark,
    width: '80%',
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center'
  }
});
