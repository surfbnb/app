import { StyleSheet } from 'react-native';
import Colors from './../../styles/Colors';

export default StyleSheet.create({
  modalContentWrapper: {
    height: '100%'
  },
  modalContent: {
    backgroundColor: Colors.primary,
    position: 'absolute',
    justifyContent: 'center',
    marginBottom: 10,
    width: '95%',
    bottom: 65,
    height: 50,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  message: {
    color: Colors.white,
    fontSize: 14
  }
});
