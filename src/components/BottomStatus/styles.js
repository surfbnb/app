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

      bottomBgInner: {
        paddingTop: 8,
        paddingBottom: 5
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
        fontWeight: '700'
      },

      handleTruncate: {
        width: '80%',
        alignItems: 'center',
        flexDirection: 'row'
      },

      handleWithTimerAndReportIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between'
      },

      ctaIconSkipFont: {
        height: 12,
        width: 12,
        marginLeft: 5,
        marginRight: 3
      }
}

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
