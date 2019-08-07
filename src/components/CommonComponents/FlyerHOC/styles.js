import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  container: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1
  },
  extensionWrapper: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  extension: {
    zIndex: -1,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)'
  },
  crossIcon: {
    marginLeft: 10
  },
  text: {
    color: 'rgba(0, 0, 0, 1)'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
