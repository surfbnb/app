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

      viewWrapper: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
        alignItems: "center"
      },

      successViewWrapper : {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        backgroundColor: '#fbfbfb' 
      },

      successText : {
        textAlign: 'center',
         fontSize: 16 
      },

      redemtionWrapper :{ 
        alignItems: "center"
      },

      heading :{ 

      },

      subText1 : {

      },

      subSection : {

      },

      heading2 : {

      },

      formInputWrapper : {

      },

      btnStyle : {
        fontSize: 16,
        textAlign: 'center' 
      }


 
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
