import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  container: {
    flex: 1
  },
  cropSection: {
    position: 'relative',
    backgroundColor: 'black'
  },
  tickIconSkipFont: {
    top: 0,
    left: 0,
    width: 45,
    height: 45
  },
  tickIconTouchable: {
    position: 'absolute',
    bottom: 22,
    right: 22,
    width: 45,
    height: 45
  },
  gallerySection: {
    backgroundColor: '#fff',
    paddingRight: 3,
    paddingTop: 3 
  },
  galleryItemSkipFont: {
    aspectRatio: 1,
    marginLeft: 3,
    marginBottom: 3,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
