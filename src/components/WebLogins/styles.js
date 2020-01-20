import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
    closeWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 999
      },
      cancel: {
        color: Colors.softBlue,
        fontWeight: '500',
        fontSize: 16
      },
      header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        position: 'absolute',
        top: 20,
        left: '45%',
        zIndex: 999
      }
  }

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
