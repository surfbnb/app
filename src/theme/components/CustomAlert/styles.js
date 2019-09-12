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
    width: 40,
    height:40,
    resizeMode: 'contain'
  },
  loadingMessage: {
    textAlign: 'center',
    fontSize: 18,
    margin: 15,
    marginBottom: 4,
    color: 'white',
    fontWeight: '500'
  },
  footerText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  }
});
