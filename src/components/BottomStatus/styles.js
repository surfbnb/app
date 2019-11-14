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
      handle: {
        fontSize: 15,
        paddingBottom: 3,
        color: Colors.white,
        fontFamily: 'AvenirNext-DemiBold',
        fontWeight: '700'
      }
}

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
