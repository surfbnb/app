import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import { Dimensions } from 'react-native';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40,
    fontWeight: '300',
    alignItems: 'stretch',
    flex: 1,
    backgroundColor: Colors.whiteSmoke
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  modalInner: {
    backgroundColor: Colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: Dimensions.get('window').height * 0.8
  },
  giphyPicker: {
    // marginBottom: 20,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.zambezi,
    borderStyle: 'dashed',
    padding: 20,
    borderRadius: 1
  },
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  overlayText: {
    color: Colors.white,
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  plusIconSkipFont: {
    width: 42,
    height: 42,
    alignSelf: 'center'
  },
  crossIconSkipFont: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 10,
    paddingVertical: 10,
    paddingLeft: 20,
    top: 20
  },
  giphyPickerText: {
    textAlign: 'center',
    color: Colors.darkGray,
    fontSize: 20,
    fontWeight: '300',
    marginTop: 10,
    fontFamily: 'Lato-Italic'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
