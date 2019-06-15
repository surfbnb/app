import { Dimensions, StyleSheet, Platform } from 'react-native';
import Colors from '../../theme/styles/Colors'

export default styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(246,246,246)'
  },
  addMessageTextStyle: {
    color: 'rgb(50,150,208)',
    fontSize: 16
  },
  switchStyle: {
    marginLeft: 10,
    justifyContent: 'flex-end',
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 25,
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
    flex: 1
  },
  modalBackDrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    flex: 1
  },
  modelWrapper:{
    top:'50%',
    transform: [{ translateY: -Dimensions.get('window').height * 0.25 }]
  },
  modalCloseBtnWrapper: {
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 25,
    height: 40,
    width: 40,
    left: '50%',
    marginLeft: -20,
    backgroundColor: 'transparent',
    marginBottom:10
  },
  modalCloseBtnContent: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 25,
    transform: [{ rotate: '45deg' }]
  },
  modalContentWrapper: {
    borderRadius: 3,
    width: Dimensions.get('window').width - 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    padding: 20,
  },
  modalHeader: {
    textAlign: 'center',
    color: '#484848',
    fontSize: 16,
    marginBottom: 15
  },
  nonEditableTextInput: {
    marginLeft: 10,
    textAlign: 'center',
    paddingRight: 10
  }
});
