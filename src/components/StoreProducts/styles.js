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
      }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
