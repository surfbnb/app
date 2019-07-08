import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import { Dimensions } from 'react-native';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
    fullScreen: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height
    },
    fullHeight: {
        width: '100%',
        height: Dimensions.get('screen').height
    },
    pepoElem: {
        alignSelf: 'flex-end', marginBottom: 15, marginRight: 20
    },
    pepoTxCount:{
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
        marginTop: 5
    },
    txElem: {
        marginBottom: 20,
        alignSelf: 'flex-end',
        marginRight: 20,
    },
      bottomContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 50
      },
  bottomBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    maxHeight: 150,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  bottomBgTxt:{
        color: 'white'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);