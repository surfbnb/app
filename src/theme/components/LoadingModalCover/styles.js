import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backgroundStyle: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  loadingImage: {
    width: 82,
    height: 52,
    marginBottom: 20
  },
  loadingMessage: {
    fontSize: 18,
    marginBottom: 15,
    color: 'white',
    fontWeight: '500'
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14
  }
});
