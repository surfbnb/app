import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
    container: {
        backgroundColor: Colors.white,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        position: 'absolute',
        width: '100%',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        bottom: 0
      },
      headerWrapper: {
        backgroundColor: Colors.white,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: Colors.whisper,
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      },
      modalHeader: {
        textAlign: 'center',
        color: Colors.valhalla,
        fontSize: 16,
        paddingVertical: 5
      },

      viewWrapper: {
        padding: 20, alignItems: "center"
      },

      loadingIcon : {
       
      },

      errorIcon : {
        width: 30, height: 30, marginBottom: 20
      },

      pepoIcon: {
        width: 25, height: 25
      },

      poductListWrapper: {
        flex: 1,
        padding: 20
      }, 

      poductListRow : {
        flexDirection: "row", justifyContent:"space-between" , paddingVertical: 10
      },

      pepoBtnStyle: {
        width: 60
      }


};

export default styles = DefaultStyleGenerator.generate(stylesMap);
