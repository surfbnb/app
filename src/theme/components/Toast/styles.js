import { StyleSheet } from 'react-native';

export default toastStyles = StyleSheet.create({
  modalContentWrapper: {
    position: 'absolute',
    bottom: 65,
    backgroundColor: '#168dc1',
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
    color: '#ffffff',
    fontSize: 14
  }
});
