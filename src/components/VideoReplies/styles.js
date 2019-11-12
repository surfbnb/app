import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
    container: {
      flex: 1,
      zIndex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    dragHandler: {
      alignSelf: 'stretch',
      height: 80,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      flexDirection: 'row',
    },
    iconWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60
      },
      iconSkipFont: {
        height: 20,
        width: 20
      },
      repliesTxt: {
        flex: 4
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
};

export default styles = DefaultStyleGenerator.generate(stylesMap);