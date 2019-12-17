import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
    container: {
        backgroundColor: Colors.white,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
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
        justifyContent: 'center'
      },
      modalHeader: {
        textAlign: 'center',
        color: Colors.valhalla,
        fontSize: 16,
        fontFamily: 'AvenirNext-DemiBold',
        paddingBottom: 5
      },

      viewWrapper: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
        alignItems: "center"
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
        flex: 1
      }, 

      poductListRow : {
        flexDirection: "row",
        justifyContent:"space-between",
        paddingVertical: 15,
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: Colors.whisper
      },

      topUpName:{
        color: Colors.valhalla,
        fontSize: 15,
        fontFamily: 'AvenirNext-DemiBold'
      },

      pepoBtnStyle: {
        minWidth: '20%',
        maxWidth: 100,
        width: 100,
        paddingHorizontal: 0,
        paddingVertical: 10
      },

      dragger: {
        backgroundColor: 'rgba(42, 41, 59, 0.44)',
        borderRadius: 2.5,
        height: 5,
        width: 75,
        alignSelf: 'center',
        marginVertical: 10
      },

      crossIconWrapper: {
        position: 'absolute',
        top: 18,
        left: 10,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100
      },

      crossIconSkipFont: {
        width: 13,
        height: 12.6
      }


};

export default styles = DefaultStyleGenerator.generate(stylesMap);
