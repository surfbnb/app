import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

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
      }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
