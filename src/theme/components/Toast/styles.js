import { StyleSheet } from 'react-native';
import Colors from './../../styles/Colors';

export default toastStyles = StyleSheet.create({
  modalContentWrapper: {
    position: 'absolute',
    bottom: 65,
    backgroundColor: Colors.primary,
    width: '95%',
    height: 50,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 8
  },
  message: {
    color: Colors.white,
    fontSize: 14
  }
});
