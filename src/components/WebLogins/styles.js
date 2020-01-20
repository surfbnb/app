import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
      cancel: {
        color: Colors.softBlue,
        fontWeight: '500',
        fontSize: 16
      },
      headerStyles: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerText:{
          fontWeight: '600'
      }
  }

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
