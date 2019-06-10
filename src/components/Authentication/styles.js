import { StyleSheet } from 'react-native';

export default (styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    width: 300
  },
  title: {
    fontSize: 24,
    margin: 10,
    textAlign: 'center'
  },
  label: {
    textAlign: 'center',
    color: 'rgb(136,136,136)',
    fontSize: 12
  },
  link: {
    textAlign: 'center',
    color: 'rgb(22,141,193)',
    fontSize: 12
  },
  error: {
    textAlign: 'center',
    color: '#de350b',
    fontSize: 12,
    marginBottom: 6
  },
  imageDimensions: {
    height: 70,
    width: 150,
    marginBottom: 20,
    alignSelf: 'center'
  },
  bottomBtnAndTxt: {
    height: 50,
  }
}));
