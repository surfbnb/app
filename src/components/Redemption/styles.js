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
        fontSize: 18,
        fontWeight: "500",
        paddingBottom: 10,
        color: Colors.black
      },

      subText1 : {
        textAlign: "center",
        color: Colors.black,
        paddingBottom: 10,
        fontSize: 12
      },

      subSection : {
        width: '100%'
      },

      heading2 : {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "500",
        color: Colors.black,
        marginBottom: 5
      },

      valueIn:{
        backgroundColor: '#e0e5e1',
        paddingVertical: 3,
        alignItems: 'center',
        marginBottom: 10
      },

      btnStyle : {
        fontSize: 16,
        textAlign: 'center' 
      },

      balanceText : {
        textAlign: "center",
        color: Colors.black,
        marginTop: 10
      }
 
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
