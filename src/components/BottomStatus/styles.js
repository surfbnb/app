import { Dimensions} from 'react-native';
import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

const { height} = Dimensions.get('window');

let stylesMap = {

    bottomBg: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderTopLeftRadius: 20,
        minHeight: height * 0.05,
        paddingHorizontal: 12
      },

      bottomBgTxt: {
        color: Colors.white
      },

      timerTxt: {
        fontSize: 12,
        color: Colors.white,
        fontFamily: 'AvenirNext-Medium'
      },

      handle: {
        fontSize: 15,
        color: Colors.white,
        fontFamily: 'AvenirNext-DemiBold',
        fontWeight: '700',
        maxWidth: '85%'
      },

      handleWithTimer: {
        paddingBottom: 3,
        marginRight: '15%',
        alignItems: 'center',
        flexDirection: 'row'
      }
}

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
