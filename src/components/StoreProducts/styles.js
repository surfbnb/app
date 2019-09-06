import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
    container: {
        backgroundColor: Colors.white,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingBottom: 50,
        position: 'absolute',
        width: '100%',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        bottom: 0
      },

      viewWrapper: {
        padding: 20, alignItems: "center"
      },

      loadingIcon : {
        width: 40, height: 40, marginBottom: 20
      },

      errorIcon : {
        width: 30, height: 30, marginBottom: 20
      },

      poductListWrapper: {
        padding: 20
      }, 

      poductListRow : {
        flexDirection: "row", justifyContent:"space-between" , paddingVertical: 10
      }


};

export default styles = DefaultStyleGenerator.generate(stylesMap);
