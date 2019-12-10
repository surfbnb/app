import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import {ifIphoneX} from "react-native-iphone-x-helper";

let stylesMap = {
    container: {
      flex: 1,
      zIndex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.white,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      overflow: 'hidden'
    },
    dragHandler: {
      height: 65,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.white,
      flexDirection: 'row',
      zIndex: 9,
      width: '100%',
      borderBottomWidth: 0.4,
      borderColor: 'rgba(0, 0, 0, 0.3)'
    },
    iconWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
        zIndex: 3
      },
      iconSkipFont: {
        height: 16,
        width: 16
      },
      repliesTxt: {
        flex: 4,
        alignItems: 'center',
        marginRight:50          //equal to crossIcon width in order to maintain text in center
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
      },
      addReplyView : {
        width:'100%',
        ...ifIphoneX(
          {
            height: 89
          },
          {
            height: 54
          }),
        shadowColor:'#000',
        elevation: 8,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,shadowRadius: 1,
        position:'absolute',
        bottom:0,
        zIndex:9999,
        backgroundColor:Colors.white
    },
    addReplyInnerView:{
      height: 54,
      width: '100%',
      flexDirection:'row',
      alignItems: 'center',
      paddingHorizontal:12,
      backgroundColor:Colors.white,
    },
    addReplyText : {
        color:Colors.black,
        marginLeft:10
    },
    addReplyImageDimensionSkipFont : {
        height:10,
        width:15
    }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
