import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
    container: {
      flex: 1,
      zIndex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    dragHandler: {
      position: 'absolute',
      height: 65,
      top: -65,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.white,
      flexDirection: 'row',
      zIndex: 9,
      width: '100%',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      overflow: 'hidden'
    },
    iconWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50
      },
      iconSkipFont: {
        height: 16,
        width: 16
      },
      repliesTxt: {
        flex: 4,
        alignItems: 'center'
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
        fontFamily: 'AvenirNext-Medium',
        color: Colors.valhalla,
        fontSize: 18
      },
      headerSubText:{
        fontSize: 12,
        color: 'rgba(42, 41, 59, 0.7)'
      }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);