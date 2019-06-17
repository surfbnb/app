import { Dimensions, StyleSheet } from 'react-native';
import Colors from '../../theme/styles/Colors';

export default styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    padding: 20,
    backgroundColor: Colors.whiteSmoke
  },
  addMessageTextStyle: {
    color: Colors.summerSky,
    fontSize: 16
  },
  switchStyle: {
    justifyContent: 'flex-end',
    borderColor: Colors.white,
    borderWidth: 0,
    borderRadius: 15
    // transform: [{ scaleX: .6 }, { scaleY: .6 }]
  },
  bottomButtonsWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end'
  },
  sendPepoBtn: {
    flex: 8,
    marginRight: 10
  },
  dottedBtn: {
    flex: 2,
    alignItems:'center'
  },
  modalBackDrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    flex: 1
  },
  modelWrapper: {
    top: '50%',
    transform: [{ translateY: -Dimensions.get('window').height * 0.25 }]
  },
  modalCloseBtnWrapper: {
    height: 40,
    width: 40,
    left: '50%',
    marginLeft: -20,
    marginBottom: 10
  },
  crossIcon: {
    width: 30,
    position: 'absolute',
    right: 10,
    top: 10,
    height: 30,
  },
  modalContentWrapper: {
    borderRadius: 3,
    width: Dimensions.get('window').width - 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
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
    paddingRight: 15
  }
});
