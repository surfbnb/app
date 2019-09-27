import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';

import Colors from '../../../theme/styles/Colors';

let stylesMap = {
    iconWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60
      },
      crossIconSkipFont: {
        height: 20,
        width: 20
      },
      tripleDotSkipFont: {
        height:4,
        width:20,
        marginRight:10
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
      },
      headerSubText:{
          fontSize: 12
      }
  }

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
