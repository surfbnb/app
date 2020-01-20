import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
    iconWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        position: 'absolute',
        top: 20,
        zIndex: 999
      },
      crossIconSkipFont: {
        height: 20,
        width: 20
      }
  }

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
