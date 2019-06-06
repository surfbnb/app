import { StyleSheet } from 'react-native';

export default (Buttons = StyleSheet.create({
  btn: {
    borderRadius: 5,
    borderWidth: 1,
    padding: 8,
    marginBottom: 12
  },
  btnText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400'
  },
  btnPrimary: {
    backgroundColor: 'rgb(22,141,193)',
    borderColor: 'rgb(22,141,193)'
  },
  btnPrimaryText: {
    color: '#ffffff'
  },
  btnSecondary: {
    backgroundColor: '#ffffff',
    borderColor: 'rgb(22,141,193)'
  },
  btnSecondaryText: {
    color: 'rgb(22,141,193)'
  },
  disabled: {
    opacity: 0.5
  }
}));
