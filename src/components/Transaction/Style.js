import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import { Dimensions, Platform } from 'react-native';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: Platform.OS == 'ios' ? 0 : 20,
    backgroundColor: Colors.whiteSmoke,
    justifyContent: 'space-between'
  },
  addMessageTextStyle: {
    color: Colors.summerSky,
    fontSize: 16
  },
  switchStyle: {
    justifyContent: 'flex-end',
    borderColor: Colors.white,
    borderWidth: 0,
    borderRadius: 15,
    marginLeft: 5
  },
  sendPepoBtn: {
    flex: 8,
    marginRight: 10,
    alignItems: 'center'
  },
  txBtnsBg: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal:5,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
  },
  dottedBtn: {
    flex: 2,
    padding: 10.5,
    alignItems: 'center',
  },
  modalBackDrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    flex: 1
  },
  modelWrapper: {
    // position: 'absolute'
  },
  modalCloseBtnWrapper: {
    height: 40,
    width: 40,
    left: '50%',
    marginLeft: -20,
    marginBottom: 10
  },
  crossIconSkipFont: {
    width: 30,
    position: 'absolute',
    right: 10,
    top: 10,
    height: 30
  },
  modalContentWrapper: {
    borderRadius: 3,
    width: Dimensions.get('window').width - 20,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    padding: 20
  },
  modalHeader: {
    textAlign: 'center',
    color: Colors.dark,
    fontSize: 16,
    marginBottom: 15
  },
  nonEditableTextInput: {
    marginLeft: 10,
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0
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
  plusIconSkipFont: {
    width: 42,
    height: 42,
    alignSelf: 'center'
  },
  giphyPickerText: {
    textAlign: 'center',
    color: Colors.darkGray,
    fontSize: 20,
    fontWeight: '300',
    marginTop: 10,
    fontFamily: 'Lato-Italic'
  },
  // crossIconSkipFont: {
  //   width: 20,
  //   height: 20,
  //   position: 'absolute',
  //   right: 10,
  //   paddingVertical: 10,
  //   paddingLeft: 20,
  //   top: 20
  // },
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
